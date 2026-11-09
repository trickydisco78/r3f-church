import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { SceneModelSchema, type SceneObject } from "@/lib/model/schema";

interface SceneState {
  objects: SceneObject[];
  selectedId: string | null;
  select: (id: string | null) => void;
  addObject: (o: SceneObject) => void;
  updateObject: (id: string, patch: Partial<SceneObject>) => void;
  removeObject: (id: string) => void;
  exportJSON: () => string;
  importJSON: (json: string) => { ok: true } | { ok: false; error: string };
}

export const useSceneStore = create<SceneState>()(
  immer((set, get) => ({
    objects: [],
    selectedId: null,
    select: (id) => set((s) => void (s.selectedId = id)),
    addObject: (o) => set((s) => void s.objects.push(o)),
    updateObject: (id, patch) =>
      set((s) => {
        const o = s.objects.find((x) => x.id === id);
        if (o) Object.assign(o, patch);
      }),
    removeObject: (id) =>
      set((s) => {
        s.objects = s.objects.filter((x) => x.id !== id);
        if (s.selectedId === id) s.selectedId = null;
      }),
    exportJSON: () =>
      JSON.stringify({ version: 1, objects: get().objects }, null, 2),
    importJSON: (json) => {
      try {
        const parsed = SceneModelSchema.safeParse(JSON.parse(json));
        if (!parsed.success) return { ok: false, error: parsed.error.message };
        set((s) => {
          s.objects = parsed.data.objects;
          s.selectedId = null;
        });
        return { ok: true };
      } catch (e) {
        return { ok: false, error: (e as Error).message };
      }
    },
  })),
);
