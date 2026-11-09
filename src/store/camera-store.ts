import { create } from "zustand";
import cameras from "@/data/cameras.json";

export interface CameraPreset {
  id: string;
  label: string;
  position: [number, number, number];
  quaternion: [number, number, number, number];
  fov: number;
}

export const CAMERA_PRESETS = cameras as CameraPreset[];

interface CameraState {
  /** Preset the rig is flying to; null when idle. */
  target: CameraPreset | null;
  /** Last preset the user jumped to (for highlighting the button). */
  current: string | null;
  flyTo: (id: string) => void;
  arrived: () => void;
  cancel: () => void;
}

export const useCameraStore = create<CameraState>()((set) => ({
  target: null,
  current: null,
  flyTo: (id) => {
    const preset = CAMERA_PRESETS.find((c) => c.id === id) ?? null;
    set({ target: preset, current: preset?.id ?? null });
  },
  arrived: () => set({ target: null }),
  cancel: () => set({ target: null, current: null }),
}));
