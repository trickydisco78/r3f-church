import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

/** All roof nodes in church.glb (Dome shares the roof naming and sits with the orthodox roof). */
export const ROOF_NODES: readonly string[] = ["Roof_ang", "Roof_mid", "Roof_orth", "Roof_rom", "Dome"];

interface ChurchState {
  roof: boolean;
  setRoof: (v: boolean) => void;
}

export const useChurchStore = create<ChurchState>()(
  immer((set) => ({
    roof: true,
    setRoof: (v) => set((s) => void (s.roof = v)),
  })),
);

export function isNodeVisible(name: string, roofVisible: boolean): boolean {
  return roofVisible || !ROOF_NODES.includes(name);
}
