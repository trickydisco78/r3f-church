import sys, math, bpy, bmesh
from mathutils import Vector
from mathutils.bvhtree import BVHTree

argv = sys.argv[sys.argv.index("--") + 1:]
src, out, mode = argv[0], argv[1], argv[2]  # mode: dry | export

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=src)

WALLS = ["Walls_anglican", "Walls_orthodox", "Walls_roman"]
EXCLUDE = {"Ground"}  # the outdoor slab must not count as an occluder

# One BVH of everything that can enclose a space (walls, roofs, floor, ...), in world space.
bm = bmesh.new()
for o in bpy.data.objects:
    if o.type != "MESH" or o.name in EXCLUDE:
        continue
    tmp = bmesh.new()
    tmp.from_mesh(o.data)
    tmp.transform(o.matrix_world)
    me = bpy.data.meshes.new("tmp")
    tmp.to_mesh(me)
    tmp.free()
    bm.from_mesh(me)
    bpy.data.meshes.remove(me)
bvh = BVHTree.FromBMesh(bm)
bm.free()

# Fibonacci-sampled directions in a cone around +Z (rotated onto each face normal below).
N = 24
CONE = []
for i in range(N):
    z = 1 - (i + 0.5) / N * 0.8  # cos(theta) from 1 down to ~0.2
    r = math.sqrt(1 - z * z)
    phi = i * math.pi * (3 - math.sqrt(5))
    CONE.append(Vector((r * math.cos(phi), r * math.sin(phi), z)))

def is_interior(center, normal):
    q = normal.to_track_quat("Z", "Y")
    origin = center + normal * 0.03
    hits = 0
    for d in CONE:
        _loc, _n, idx, _dist = bvh.ray_cast(origin, q @ d, 60.0)
        if idx is not None:
            hits += 1
    return hits / N >= 0.6

white = bpy.data.materials.new("Church_Plaster_Interior")
white.use_nodes = True
bsdf = white.node_tree.nodes["Principled BSDF"]
bsdf.inputs["Base Color"].default_value = (0.95, 0.95, 0.93, 1)
bsdf.inputs["Roughness"].default_value = 0.9

for name in WALLS:
    o = bpy.data.objects[name]
    me = o.data
    me.materials.append(white)
    inner_idx = len(me.materials) - 1
    total = inside = 0
    area_in = area_out = 0.0
    for p in me.polygons:
        c = o.matrix_world @ p.center
        n = (o.matrix_world.to_3x3() @ p.normal).normalized()
        total += 1
        if abs(n.z) < 0.5 and is_interior(c, n):  # top rims and sills stay exterior
            inside += 1
            area_in += p.area
            p.material_index = inner_idx
        else:
            area_out += p.area
    print(f"[walls] {name}: {inside}/{total} faces interior, area in={area_in:.1f} out={area_out:.1f}")

if mode == "export":
    bpy.ops.export_scene.gltf(filepath=out, export_format="GLB", export_yup=True,
                              export_apply=False, export_materials="EXPORT")
    print("[export] wrote", out)
