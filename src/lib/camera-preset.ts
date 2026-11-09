import * as THREE from "three";
import type { CameraPreset } from "@/store/camera-store";

const _fwd = new THREE.Vector3();
const _quat = new THREE.Quaternion();
const _pos = new THREE.Vector3();

/**
 * Orbit-target point for a Blender camera preset: straight ahead of the camera (Blender cameras
 * look down -Z). Distance is how far the camera is from the origin, but never closer than 3 m.
 */
export function presetLookTarget(preset: CameraPreset, out = new THREE.Vector3()): THREE.Vector3 {
  _pos.set(...preset.position);
  _quat.set(...preset.quaternion);
  _fwd.set(0, 0, -1).applyQuaternion(_quat);
  return out.copy(_pos).addScaledVector(_fwd, Math.max(3, _pos.length()));
}
