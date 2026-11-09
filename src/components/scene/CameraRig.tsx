"use client";
import { useEffect } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { useCameraStore } from "@/store/camera-store";
import { presetLookTarget } from "@/lib/camera-preset";

const SMOOTHING = 4; // higher = snappier
const _pos = new THREE.Vector3();
const _look = new THREE.Vector3();

/**
 * Flies the viewport camera to the Blender cameras (see src/data/cameras.json).
 * The orbit target is placed straight ahead of each Blender camera so that orbiting
 * afterwards pivots around what that camera was looking at.
 */
export function CameraRig() {
  const controls = useThree((s) => s.controls);

  // Dragging with the mouse cancels any flight in progress.
  useEffect(() => {
    const c = controls as unknown as OrbitControlsImpl | null;
    if (!c) return;
    const stop = () => useCameraStore.getState().cancel();
    c.addEventListener("start", stop);
    return () => c.removeEventListener("start", stop);
  }, [controls]);

  useFrame((state, delta) => {
    const preset = useCameraStore.getState().target;
    const c = state.controls as unknown as OrbitControlsImpl | null;
    const cam = state.camera as THREE.PerspectiveCamera;
    if (!preset || !c) return;

    _pos.set(...preset.position);
    presetLookTarget(preset, _look);

    const k = 1 - Math.exp(-SMOOTHING * delta);
    cam.position.lerp(_pos, k);
    c.target.lerp(_look, k);
    cam.fov = THREE.MathUtils.lerp(cam.fov, preset.fov, k);
    cam.updateProjectionMatrix();
    c.update();

    if (cam.position.distanceTo(_pos) < 0.02 && c.target.distanceTo(_look) < 0.05) {
      cam.position.copy(_pos);
      c.target.copy(_look);
      cam.fov = preset.fov;
      cam.updateProjectionMatrix();
      c.update();
      useCameraStore.getState().arrived();
    }
  });

  return null;
}
