"use client";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment, Grid, OrbitControls } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";
import { useSceneStore } from "@/store/scene-store";
import { CameraRig } from "./CameraRig";
import { SceneObjectMesh } from "./SceneObjectMesh";
import { Church } from "@/components/models/Church";

export default function Viewport() {
  const objects = useSceneStore((s) => s.objects);
  const select = useSceneStore((s) => s.select);

  return (
    <Canvas
      shadows
      camera={{ position: [4, 3, 5], fov: 50 }}
      onPointerMissed={() => select(null)}
    >
      <color attach="background" args={["#0b0b10"]} />
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
      <Suspense fallback={null}>
        <Environment preset="city" />
        <Church />
        {objects.map((o) => (
          <SceneObjectMesh key={o.id} object={o} />
        ))}
      </Suspense>
      <Grid infiniteGrid fadeDistance={30} cellColor="#2a2a3a" sectionColor="#4a4a6a" />
      <ContactShadows position={[0, 0.001, 0]} opacity={0.5} blur={2} far={4} />
      <OrbitControls makeDefault maxPolarAngle={Math.PI / 2.05} />
      <CameraRig />
      <EffectComposer>
        <Bloom intensity={0.3} luminanceThreshold={0.9} />
      </EffectComposer>
    </Canvas>
  );
}
