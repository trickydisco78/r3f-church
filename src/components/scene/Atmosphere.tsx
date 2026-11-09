"use client";
import { Sky } from "@react-three/drei";
import { SUN_POSITION } from "@/lib/sun";

/** Matches the sky near the horizon so the distance fades into haze rather than a hard edge. */
const HAZE = "#c9d6e0";
const GRASS = "#3f6a2c"; // same base as the procedural grass texture

/** Sky, distance fog and a ground that continues past the model's own (finite) ground plane. */
export function Atmosphere() {
  return (
    <>
      <fog attach="fog" args={[HAZE, 40, 260]} />
      <Sky sunPosition={SUN_POSITION} turbidity={3.5} rayleigh={1.1} mieCoefficient={0.005} mieDirectionalG={0.8} />
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.36, 0]}>
        <circleGeometry args={[800, 64]} />
        <meshStandardMaterial color={GRASS} roughness={1} />
      </mesh>
    </>
  );
}
