import { z } from "zod";

export const Vec3 = z.tuple([z.number(), z.number(), z.number()]);

export const SceneObjectSchema = z.object({
  id: z.string(),
  name: z.string(),
  kind: z.enum(["box", "sphere", "gltf"]),
  position: Vec3,
  rotation: Vec3,
  scale: Vec3,
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  src: z.string().optional(), // path under /public for gltf objects
});

export const SceneModelSchema = z.object({
  version: z.literal(1),
  objects: z.array(SceneObjectSchema),
});

export type SceneObject = z.infer<typeof SceneObjectSchema>;
export type SceneModel = z.infer<typeof SceneModelSchema>;
