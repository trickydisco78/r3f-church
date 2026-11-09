"use client";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import windowData from "@/data/windows.json";
import { isNodeVisible, useChurchStore } from "@/store/church-store";

/**
 * The Anglican roof is a gable roof (ridge running corner to corner) made of just two planes, but the
 * wall meshes stop at the eave line (7 m). Where the roof rises above that, the triangular gable
 * ends were never modelled, leaving open gaps under the roof edge.
 *
 * This fills them: for each edge of the hexagonal footprint, a thin panel flush with the outer wall
 * face, from the wall top up to the roof surface, which is read from the roof mesh itself.
 */

const WALL_TOP = 7;
const SEAM = 0.05; // start slightly inside the wall so no crack shows at the join
const INSET = 0.02; // keep the panel off the wall's outer face to avoid z-fighting

type Plane = (x: number, z: number) => number;

/** Height of the plane through three points as a function of (x, z). */
function planeThrough(a: THREE.Vector3, b: THREE.Vector3, c: THREE.Vector3): Plane {
  const n = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a));
  const d = n.dot(a);
  return (x, z) => (d - n.x * x - n.z * z) / n.y;
}

function buildGableEnds(roof: THREE.BufferGeometry, area: { centre: number[]; radius: number }): THREE.BufferGeometry | null {
  const pos = roof.getAttribute("position");
  const index = roof.index;
  if (!index) return null;

  // Group the roof triangles into planes by normal direction (a gable has two).
  const planes: { n: THREE.Vector3; fn: Plane }[] = [];
  for (let t = 0; t < index.count; t += 3) {
    const [a, b, c] = [0, 1, 2].map((k) => new THREE.Vector3().fromBufferAttribute(pos, index.getX(t + k)));
    const n = new THREE.Vector3().subVectors(b, a).cross(new THREE.Vector3().subVectors(c, a)).normalize();
    if (n.y < 0) n.negate();
    if (!planes.some((p) => p.n.dot(n) > 0.999)) planes.push({ n, fn: planeThrough(a, b, c) });
  }
  if (planes.length === 0) return null;
  // A convex roof's surface is the lowest of its planes at any point.
  const roofHeight = (x: number, z: number) => Math.min(...planes.map((p) => p.fn(x, z)));

  const [cx, cz] = area.centre;
  const verts: number[] = [];
  for (let k = 0; k < 6; k++) {
    // Footprint corners: regular hexagon with vertices at +-X. Edge normal points outward.
    const a0 = (k * Math.PI) / 3;
    const a1 = ((k + 1) * Math.PI) / 3;
    const mid = a0 + Math.PI / 6;
    const inX = -Math.cos(mid) * INSET;
    const inZ = -Math.sin(mid) * INSET;
    const p0 = [cx + area.radius * Math.cos(a0) + inX, cz + area.radius * Math.sin(a0) + inZ];
    const p1 = [cx + area.radius * Math.cos(a1) + inX, cz + area.radius * Math.sin(a1) + inZ];
    const h0 = Math.max(WALL_TOP, roofHeight(p0[0], p0[1]));
    const h1 = Math.max(WALL_TOP, roofHeight(p1[0], p1[1]));
    if (Math.max(h0, h1) - WALL_TOP < 0.05) continue; // roof meets the wall top here: no gap
    const bottom = WALL_TOP - SEAM;
    verts.push(
      p0[0], bottom, p0[1], p1[0], bottom, p1[1], p1[0], h1, p1[1],
      p0[0], bottom, p0[1], p1[0], h1, p1[1], p0[0], h0, p0[1],
    );
  }
  if (verts.length === 0) return null;

  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.Float32BufferAttribute(verts, 3));
  geo.computeVertexNormals();
  return geo;
}

/** Plaster panels closing the gable ends of the Anglican roof. Hidden together with the roof. */
export function GableEnds({ roofGeometry, material }: { roofGeometry: THREE.BufferGeometry; material: THREE.Material }) {
  const roof = useChurchStore((s) => s.roof);
  const geometry = useMemo(() => {
    const area = windowData.areas.find((a) => a.name === "anglican");
    return area ? buildGableEnds(roofGeometry, area) : null;
  }, [roofGeometry]);

  // Own copy: the walls share the original plaster material and must stay single-sided.
  const gableMaterial = useMemo(() => {
    const m = material.clone();
    m.side = THREE.DoubleSide;
    return m;
  }, [material]);
  useEffect(() => () => gableMaterial.dispose(), [gableMaterial]);

  if (!geometry) return null;
  return (
    <mesh
      name="Gable_ang"
      visible={isNodeVisible("Gable_ang", roof)}
      castShadow
      receiveShadow
      geometry={geometry}
      material={gableMaterial}
    />
  );
}
