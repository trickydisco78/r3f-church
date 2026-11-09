import * as THREE from "three";

/**
 * Splits a mesh into triangles for which `test(centreX, centreY, centreZ)` is false and true.
 * Keeps position and normal (the model's meshes carry no UVs). Used to pull individual objects
 * (roof crosses, door leaves) out of the model's merged meshes.
 */
export function splitBy(
  source: THREE.BufferGeometry,
  test: (x: number, y: number, z: number) => boolean,
): [rest: THREE.BufferGeometry, picked: THREE.BufferGeometry] {
  const geo = source.index ? source.toNonIndexed() : source;
  const pos = geo.getAttribute("position");
  const nor = geo.getAttribute("normal");
  const lo = { p: [] as number[], n: [] as number[] };
  const hi = { p: [] as number[], n: [] as number[] };

  for (let t = 0; t < pos.count; t += 3) {
    const cx = (pos.getX(t) + pos.getX(t + 1) + pos.getX(t + 2)) / 3;
    const cy = (pos.getY(t) + pos.getY(t + 1) + pos.getY(t + 2)) / 3;
    const cz = (pos.getZ(t) + pos.getZ(t + 1) + pos.getZ(t + 2)) / 3;
    const bucket = test(cx, cy, cz) ? hi : lo;
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

/** Splits at height `y`: triangles below, and triangles at or above (e.g. the roof crosses). */
export function splitByHeight(source: THREE.BufferGeometry, y: number) {
  return splitBy(source, (_x, cy) => cy >= y);
}
