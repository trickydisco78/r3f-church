"use client";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

/** Max real point lights; every flame still gets a glow sprite. Lights are costly per fragment. */
const MAX_LIGHTS = 8;
const CLUSTER_RADIUS = 0.15; // metres: vertices closer than this in XZ belong to one flame

interface Flame {
  position: [number, number, number];
  height: number;
  light: boolean;
}

/** Finds each candle flame by clustering the vertices of the model's merged Flame mesh. */
function findFlames(geometry: THREE.BufferGeometry): Flame[] {
  const pos = geometry.getAttribute("position");
  const clusters: { x: number; z: number; minY: number; maxY: number }[] = [];
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const c = clusters.find((k) => Math.abs(k.x - x) < CLUSTER_RADIUS && Math.abs(k.z - z) < CLUSTER_RADIUS);
    if (c) {
      c.minY = Math.min(c.minY, y);
      c.maxY = Math.max(c.maxY, y);
    } else {
      clusters.push({ x, z, minY: y, maxY: y });
    }
  }
  const step = Math.max(1, Math.ceil(clusters.length / MAX_LIGHTS));
  return clusters.map((c, i) => ({
    position: [c.x, (c.minY + c.maxY) / 2, c.z],
    height: c.maxY - c.minY,
    light: i % step === 0,
  }));
}

function makeGlowTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
  g.addColorStop(0, "rgba(255,230,160,1)");
  g.addColorStop(0.25, "rgba(255,160,60,0.55)");
  g.addColorStop(1, "rgba(255,100,20,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

/** Layered sines give a cheap, deterministic flicker (0..1 around ~0.8). */
function flicker(t: number, seed: number) {
  return 0.8 + 0.12 * Math.sin(t * 9 + seed * 3.1) + 0.08 * Math.sin(t * 23 + seed * 7.7) + 0.05 * Math.sin(t * 41 + seed);
}

export function CandleFlames({ geometry }: { geometry: THREE.BufferGeometry }) {
  const flames = useMemo(() => findFlames(geometry), [geometry]);
  const glow = useMemo(() => makeGlowTexture(), []);
  const sprites = useRef<(THREE.Sprite | null)[]>([]);
  const lights = useRef<(THREE.PointLight | null)[]>([]);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    flames.forEach((f, i) => {
      const k = flicker(t, i);
      const s = sprites.current[i];
      if (s) {
        const size = f.height * 5 * (0.9 + 0.2 * k);
        s.scale.set(size, size * 1.2, 1);
      }
      const l = lights.current[i];
      if (l) l.intensity = 2.5 * k;
    });
  });

  return (
    <group>
      {flames.map((f, i) => (
        <group key={i} position={f.position}>
          <sprite ref={(el) => void (sprites.current[i] = el)} renderOrder={10}>
            <spriteMaterial
              map={glow}
              color="#ffb25a"
              blending={THREE.AdditiveBlending}
              transparent
              depthWrite={false}
              toneMapped={false}
            />
          </sprite>
          {f.light && (
            <pointLight
              ref={(el) => void (lights.current[i] = el)}
              color="#ffa94d"
              distance={6}
              decay={2}
              position={[0, 0.05, 0]}
            />
          )}
        </group>
      ))}
    </group>
  );
}
