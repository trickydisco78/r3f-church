import * as THREE from "three";

/**
 * Returns a clone of `geometry` with world-scaled box-projected UVs, so one texture
 * tile covers `tileSize` metres. Needed for meshes exported without UVs.
 */
export function withBoxUVs(geometry: THREE.BufferGeometry, tileSize: number): THREE.BufferGeometry {
  const g = geometry.clone();
  const pos = g.getAttribute("position");
  const nor = g.getAttribute("normal");
  const uv = new Float32Array(pos.count * 2);

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const ax = Math.abs(nor.getX(i));
    const ay = Math.abs(nor.getY(i));
    const az = Math.abs(nor.getZ(i));
    let u: number;
    let v: number;
    if (ay >= ax && ay >= az) {
      u = x; v = z; // horizontal surfaces
    } else if (ax >= az) {
      u = z; v = y; // faces pointing along X
    } else {
      u = x; v = y; // faces pointing along Z
    }
    uv[i * 2] = u / tileSize;
    uv[i * 2 + 1] = v / tileSize;
  }
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return g;
}

/**
 * Returns a clone of `geometry` with UVs laid out along each face's slope: u runs along the
 * horizontal (eave) direction, v runs down the slope. Suits pitched roofs, where box projection
 * would stretch textures. Faces pointing straight up/down fall back to an X/Z projection.
 */
export function withSlopeUVs(geometry: THREE.BufferGeometry, tileSize: number): THREE.BufferGeometry {
  const g = geometry.clone();
  const pos = g.getAttribute("position");
  const nor = g.getAttribute("normal");
  const uv = new Float32Array(pos.count * 2);
  const n = new THREE.Vector3();
  const u = new THREE.Vector3();
  const v = new THREE.Vector3();
  const up = new THREE.Vector3(0, 1, 0);

  for (let i = 0; i < pos.count; i++) {
    n.fromBufferAttribute(nor, i).normalize();
    u.crossVectors(up, n);
    if (u.lengthSq() < 1e-6) u.set(1, 0, 0);
    u.normalize();
    v.crossVectors(n, u).normalize();
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    uv[i * 2] = (u.x * x + u.y * y + u.z * z) / tileSize;
    uv[i * 2 + 1] = (v.x * x + v.y * y + v.z * z) / tileSize;
  }
  g.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
  return g;
}
