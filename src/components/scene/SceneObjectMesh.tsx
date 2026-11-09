"use client";
import { useGLTF } from "@react-three/drei";
import type { SceneObject } from "@/lib/model/schema";
import { useSceneStore } from "@/store/scene-store";

function GltfModel({ src }: { src: string }) {
  const { scene } = useGLTF(src);
  return <primitive object={scene.clone()} />;
}

export function SceneObjectMesh({ object }: { object: SceneObject }) {
  const select = useSceneStore((s) => s.select);
  const selected = useSceneStore((s) => s.selectedId === object.id);

  return (
    <group
      position={object.position}
      rotation={object.rotation}
      scale={object.scale}
      onClick={(e) => {
        e.stopPropagation();
        select(object.id);
      }}
    >
      {object.kind === "gltf" && object.src ? (
        <GltfModel src={object.src} />
      ) : (
        <mesh castShadow receiveShadow>
          {object.kind === "sphere" ? (
            <sphereGeometry args={[0.5, 32, 32]} />
          ) : (
            <boxGeometry />
          )}
          <meshStandardMaterial
            color={object.color}
            emissive={selected ? "#ffffff" : "#000000"}
            emissiveIntensity={selected ? 0.15 : 0}
          />
        </mesh>
      )}
    </group>
  );
}
