// Usage: node scripts/extract-cameras.mjs <input.glb> [output.json]
// Reads the cameras from a GLB (export from Blender with Include > Cameras ticked)
// and writes a small JSON file the app imports, so the model itself isn't reloaded.
import { readFileSync, writeFileSync } from "node:fs";

const [input, output = "src/data/cameras.json"] = process.argv.slice(2);
if (!input) {
  console.error("usage: node scripts/extract-cameras.mjs <input.glb> [output.json]");
  process.exit(1);
}

const EXCLUDE = new Set(["Camera"]); // Blender's default camera name

const buf = readFileSync(input);
const jsonLen = buf.readUInt32LE(12);
const gltf = JSON.parse(buf.subarray(20, 20 + jsonLen).toString("utf8"));

const cameras = gltf.nodes
  .filter((n) => n.camera !== undefined && !EXCLUDE.has(n.name))
  .map((n) => ({
    id: n.name,
    label: n.name.replace(/^Cam_/, "").replace(/_/g, " "),
    position: n.translation ?? [0, 0, 0],
    quaternion: n.rotation ?? [0, 0, 0, 1],
    fov: +((gltf.cameras[n.camera].perspective.yfov * 180) / Math.PI).toFixed(2),
  }));

writeFileSync(output, JSON.stringify(cameras, null, 2) + "\n");
console.log(`wrote ${cameras.length} cameras to ${output}:`, cameras.map((c) => c.id).join(", "));
