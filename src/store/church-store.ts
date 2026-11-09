import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

/** All roof nodes in the church model (Dome shares the roof naming and sits with the orthodox roof; Gold_roof is the roof crosses, Gable_ang the Anglican gable ends). */
export const ROOF_NODES: readonly string[] = ["Roof_ang", "Roof_mid", "Roof_orth", "Roof_rom", "Dome", "Gold_roof", "Gable_ang"];

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
