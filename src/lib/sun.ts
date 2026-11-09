import * as THREE from "three";

/**
 * One sun for the whole scene: it drives the shadow-casting light, the sky and the coloured
 * light that falls through the stained-glass windows (see WindowLight).
 * Azimuth is measured from +Z towards +X, elevation up from the horizon.
 */
const AZIMUTH = THREE.MathUtils.degToRad(70);
const ELEVATION = THREE.MathUtils.degToRad(38);

/** Unit vector pointing FROM the scene TOWARDS the sun. */
export const SUN_DIRECTION = new THREE.Vector3(
  Math.cos(ELEVATION) * Math.sin(AZIMUTH),
  Math.sin(ELEVATION),
  Math.cos(ELEVATION) * Math.cos(AZIMUTH),
).normalize();

const SUN_DISTANCE = 120;
export const SUN_POSITION: [number, number, number] = [
  SUN_DIRECTION.x * SUN_DISTANCE,
  SUN_DIRECTION.y * SUN_DISTANCE,
  SUN_DIRECTION.z * SUN_DISTANCE,
];
