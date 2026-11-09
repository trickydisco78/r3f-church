import * as THREE from "three";

/**
 * Splits a mesh into the triangles whose centre is below `y` and those at or above it.
 * Used to separate the roof crosses from the rest of the merged `Gold` mesh, so they can be
 * hidden together with the roof. Keeps position and normal (the model's meshes carry no UVs).
 */
export function splitByHeight(source: THREE.BufferGeometry, y: number): [below: THREE.BufferGeometry, above: THREE.BufferGeometry] {
  const geo = source.index ? source.toNonIndexed() : source;
  const pos = geo.getAttribute("position");
  const nor = geo.getAttribute("normal");
  const lo = { p: [] as number[], n: [] as number[] };
  const hi = { p: [] as number[], n: [] as number[] };

  for (let t = 0; t < pos.count; t += 3) {
    const centreY = (pos.getY(t) + pos.getY(t + 1) + pos.getY(t + 2)) / 3;
    const bucket = centreY >= y ? hi : lo;
    for (let k = t; k < t + 3; k++) {
      bucket.p.push(pos.getX(k), pos.getY(k), pos.getZ(k));
      if (nor) bucket.n.push(nor.getX(k), nor.getY(k), nor.getZ(k));
    }
  }

  const build = (b: { p: number[]; n: number[] }) => {
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(b.p, 3));
    if (nor) g.setAttribute("normal", new THREE.Float32BufferAttribute(b.n, 3));
    return g;
  };
  return [build(lo), build(hi)];
}
