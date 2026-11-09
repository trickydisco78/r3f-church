"use client";
import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer, N8AO, SMAA, ToneMapping } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { useSceneStore } from "@/store/scene-store";
import { CameraRig } from "./CameraRig";
import { Atmosphere } from "./Atmosphere";
import { SceneObjectMesh } from "./SceneObjectMesh";
import { Church } from "@/components/models/Church";
import { WindowLight } from "@/components/models/WindowLight";
import { DEFAULT_CAMERA } from "@/store/camera-store";
import { presetLookTarget } from "@/lib/camera-preset";
import { SUN_POSITION } from "@/lib/sun";

const START_POSITION = DEFAULT_CAMERA.position;
const START_TARGET = presetLookTarget(DEFAULT_CAMERA).toArray();

/** Half-width (m) of the area the sun's shadow map covers: the whole building plus a margin. */
const SHADOW_EXTENT = 30;

export default function Viewport() {
  const objects = useSceneStore((s) => s.objects);
  const select = useSceneStore((s) => s.select);
  // PerformanceMonitor drops to "low" on slow devices: cheaper shadows, no ambient occlusion.
  const [quality, setQuality] = useState<"high" | "low">("high");
  const high = quality === "high";

  return (
    <Canvas
      shadows
      dpr={high ? [1, 1.75] : 1}
      camera={{ position: START_POSITION, fov: DEFAULT_CAMERA.fov, near: 0.1, far: 1500 }}
      onPointerMissed={() => select(null)}
    >
      <PerformanceMonitor onDecline={() => setQuality("low")} />
      <Atmosphere />

      {/* Fill light comes from the sky environment; the sun is the one shadow-casting light. */}
      <ambientLight intensity={0.12} />
      <directionalLight
        position={SUN_POSITION}
        intensity={2.4}
        color="#fff1dc"
        castShadow
        shadow-mapSize={high ? [2048, 2048] : [1024, 1024]}
        shadow-camera-left={-SHADOW_EXTENT}
        shadow-camera-right={SHADOW_EXTENT}
        shadow-camera-top={SHADOW_EXTENT}
        shadow-camera-bottom={-SHADOW_EXTENT}
        shadow-camera-near={1}
        shadow-camera-far={300}
        shadow-bias={-0.0003}
        shadow-normalBias={0.05}
      />

      <Suspense fallback={null}>
        <Environment preset="park" environmentIntensity={0.7} />
        <Church />
        <WindowLight />
        {objects.map((o) => (
          <SceneObjectMesh key={o.id} object={o} />
        ))}
      </Suspense>

      <OrbitControls makeDefault target={START_TARGET} maxPolarAngle={Math.PI / 2.05} />
      <CameraRig />

      {/* N8AO needs MSAA off; SMAA at the end handles edges. The composer disables the renderer's
          own tone mapping, so ToneMapping must be an effect. */}
      <EffectComposer multisampling={0}>
        <N8AO aoRadius={2} distanceFalloff={1} intensity={2.5} quality="medium" halfRes={!high} enabled={high} />
        <Bloom intensity={0.35} luminanceThreshold={0.85} mipmapBlur />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <SMAA />
      </EffectComposer>
    </Canvas>
  );
}
