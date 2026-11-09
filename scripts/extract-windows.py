#!/usr/bin/env python3
"""Extract stained-glass window placement from the church GLB into src/data/windows.json.

The coloured glass meshes (StainedGlass_*) each hold hundreds of separate panes. This groups the
panes into windows and records, per window: centre, horizontal direction along the glass, width,
height, outward direction (away from its worship area) and colour mix. The viewer uses this to
cast coloured sunlight through the windows (src/components/models/WindowLight.tsx).

Needs an UNCOMPRESSED glb (the shipped one is Draco-compressed):
  npx @gltf-transform/cli@4 copy public/models/churchv-stained.glb /tmp/church-unc.glb
  python3 scripts/extract-windows.py /tmp/church-unc.glb src/data/windows.json

Standard library only.
"""
import json
import math
import struct
import sys

CLUSTER_RADIUS = 0.8  # metres: panes closer than this belong to the same window
COLOURS = ["amber", "cobalt", "emerald", "ruby", "teal", "violet"]


def load(path):
    d = open(path, "rb").read()
    jl = struct.unpack("<I", d[12:16])[0]
    j = json.loads(d[20 : 20 + jl])
    off = 20 + jl
    bl = struct.unpack("<I", d[off : off + 4])[0]
    return j, d[off + 8 : off + 8 + bl]


def main(src, dst):
    j, bin_ = load(src)
    nodes = {n.get("name"): n for n in j["nodes"]}

    def positions(i):
        a = j["accessors"][i]
        bv = j["bufferViews"][a["bufferView"]]
        start = bv.get("byteOffset", 0) + a.get("byteOffset", 0)
        stride = bv.get("byteStride") or 12
        return [struct.unpack_from("<fff", bin_, start + k * stride) for k in range(a["count"])]

    def indices(i):
        a = j["accessors"][i]
        bv = j["bufferViews"][a["bufferView"]]
        start = bv.get("byteOffset", 0) + a.get("byteOffset", 0)
        fmt, size = {5123: ("H", 2), 5125: ("I", 4), 5121: ("B", 1)}[a["componentType"]]
        return [struct.unpack_from("<" + fmt, bin_, start + k * size)[0] for k in range(a["count"])]

    def mesh_geometry(name):
        m = j["meshes"][nodes[name]["mesh"]]
        verts, tris = [], []
        for p in m["primitives"]:
            base = len(verts)
            verts += positions(p["attributes"]["POSITION"])
            ids = indices(p["indices"])
            tris += [(base + ids[k], base + ids[k + 1], base + ids[k + 2]) for k in range(0, len(ids), 3)]
        return verts, tris

    def bbox(name):
        v, _ = mesh_geometry(name)
        return [min(p[k] for p in v) for k in range(3)], [max(p[k] for p in v) for k in range(3)]

    # Worship areas are regular hexagons with vertices at +-X (flat edges facing +-Z). Centre and
    # circumradius come from each wall mesh's bounding box. Used to decide which way is "outward"
    # and, in the viewer, to keep light patches inside the building.
    area_list = []
    for n in ("Walls_roman", "Walls_orthodox", "Walls_anglican"):
        mn, mx = bbox(n)
        radius = (mx[0] - mn[0]) / 2
        depth_ratio = (mx[2] - mn[2]) / (mx[0] - mn[0])
        assert abs(depth_ratio - math.sqrt(3) / 2) < 0.02, f"{n} is not a flat-edged regular hexagon"
        area_list.append(
            {"name": n.replace("Walls_", ""), "centre": [round((mn[0] + mx[0]) / 2, 3), round((mn[2] + mx[2]) / 2, 3)], "radius": round(radius, 3)}
        )
    areas = {a["name"]: tuple(a["centre"]) for a in area_list}

    # 1) connected pieces (panes) of every coloured glass mesh
    panes = []
    for colour in COLOURS:
        verts, tris = mesh_geometry("StainedGlass_" + colour)
        parent = list(range(len(verts)))

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        for a, b, c in tris:
            parent[find(a)] = find(b)
            parent[find(b)] = find(c)
        pieces = {}
        for i, p in enumerate(verts):
            pieces.setdefault(find(i), []).append(p)
        for pts in pieces.values():
            panes.append(([sum(p[k] for p in pts) / len(pts) for k in range(3)], colour))

    # 2) group panes into windows (single-link clustering on a grid)
    r = CLUSTER_RADIUS
    cells = {}
    for i, (p, _) in enumerate(panes):
        cells.setdefault((int(p[0] // r), int(p[1] // r), int(p[2] // r)), []).append(i)
    parent = list(range(len(panes)))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    for i, (p, _) in enumerate(panes):
        cx, cy, cz = int(p[0] // r), int(p[1] // r), int(p[2] // r)
        for dx in (-1, 0, 1):
            for dy in (-1, 0, 1):
                for dz in (-1, 0, 1):
                    for k in cells.get((cx + dx, cy + dy, cz + dz), []):
                        if k != i and math.dist(p, panes[k][0]) < r:
                            parent[find(i)] = find(k)
    groups = {}
    for i in range(len(panes)):
        groups.setdefault(find(i), []).append(i)

    windows = []
    for g in groups.values():
        if len(g) < 20:  # ignore stray fragments
            continue
        pts = [panes[i][0] for i in g]
        mn = [min(p[k] for p in pts) for k in range(3)]
        mx = [max(p[k] for p in pts) for k in range(3)]
        centre = [(mn[k] + mx[k]) / 2 for k in range(3)]
        # Horizontal direction along the glass = principal axis of the panes in XZ.
        mx_, mz_ = centre[0], centre[2]
        sxx = sum((p[0] - mx_) ** 2 for p in pts)
        szz = sum((p[2] - mz_) ** 2 for p in pts)
        sxz = sum((p[0] - mx_) * (p[2] - mz_) for p in pts)
        ang = 0.5 * math.atan2(2 * sxz, sxx - szz)
        right = (math.cos(ang), math.sin(ang))
        along = [(p[0] - mx_) * right[0] + (p[2] - mz_) * right[1] for p in pts]
        width = (max(along) - min(along)) + 0.3
        height = (mx[1] - mn[1]) + 0.3
        # Outward = away from the nearest worship-area centre, perpendicular to the glass.
        area_idx = min(range(len(area_list)), key=lambda k: math.hypot(area_list[k]["centre"][0] - centre[0], area_list[k]["centre"][1] - centre[2]))
        area = area_list[area_idx]["centre"]
        normal = (-right[1], right[0])
        if normal[0] * (centre[0] - area[0]) + normal[1] * (centre[2] - area[1]) < 0:
            normal = (-normal[0], -normal[1])
        counts = {c: 0 for c in COLOURS}
        for i in g:
            counts[panes[i][1]] += 1
        total = sum(counts.values())
        windows.append(
            {
                "centre": [round(x, 3) for x in centre],
                "right": [round(right[0], 4), 0, round(right[1], 4)],
                "outward": [round(normal[0], 4), 0, round(normal[1], 4)],
                "area": area_idx,
                "width": round(width, 3),
                "height": round(height, 3),
                "colours": {c: round(counts[c] / total, 3) for c in COLOURS},
            }
        )

    windows.sort(key=lambda w: (round(w["centre"][2]), w["centre"][0]))
    json.dump({"areas": area_list, "windows": windows}, open(dst, "w"), indent=1)
    print(f"{len(panes)} panes -> {len(windows)} windows -> {dst}")


if __name__ == "__main__":
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    main(sys.argv[1], sys.argv[2])
