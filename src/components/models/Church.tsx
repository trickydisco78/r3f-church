/*
Based on gltfjsx output for the v5 model:
  npx gltfjsx@6.5.3 public/models/churchv5.glb --types --shadows
then hand-modified. Do NOT regenerate over this file; instead re-run gltfjsx to a scratch
file and diff node/material names. Hand edits:
  - roof visibility toggle (isNodeVisible)
  - procedural textures + projected UVs for roof, pews and ground (those meshes have no UVs)
  - candle flames (CandleFlames)
  - the 100+ stained-glass `Curve###` meshes are rendered in a loop with the file's own materials
  - the GLB's cameras are not rendered; camera views come from src/data/cameras.json
The model is Draco-compressed; drei's useGLTF loads the decoder automatically.
*/

import * as THREE from 'three'
import { useMemo, type ComponentProps } from 'react'
import { isNodeVisible, useChurchStore } from '@/store/church-store'
import { CandleFlames } from './CandleFlames'
import { withBoxUVs, withSlopeUVs } from '@/lib/box-uv'
import { makeGrassTextures, makeRoofTileTextures, makeSlateTextures, makeWoodTextures } from '@/lib/procedural-textures'
import { useGLTF } from '@react-three/drei'
import type { GLTF } from 'three-stdlib'

const MODEL_URL = '/models/churchv5.glb'

type GLTFResult = GLTF & {
  nodes: {
    Altar: THREE.Mesh
    Cloth: THREE.Mesh
    Confess: THREE.Mesh
    Cube: THREE.Mesh
    Dome: THREE.Mesh
    Door: THREE.Mesh
    Doorframe: THREE.Mesh
    Flame: THREE.Mesh
    Floor: THREE.Mesh
    Font: THREE.Mesh
    Frontwall: THREE.Mesh
    Glass: THREE.Mesh
    Gold: THREE.Mesh
    Ground: THREE.Mesh
    Ironmongery: THREE.Mesh
    Organ_case: THREE.Mesh
    Organ_pipes: THREE.Mesh
    Pews: THREE.Mesh
    Platform: THREE.Mesh
    Roof_ang: THREE.Mesh
    Roof_mid: THREE.Mesh
    Roof_orth: THREE.Mesh
    Roof_rom: THREE.Mesh
    Stand: THREE.Mesh
    Walls_anglican: THREE.Mesh
    Walls_orthodox: THREE.Mesh
    Walls_roman: THREE.Mesh
    Water: THREE.Mesh
    Wax: THREE.Mesh
    /** Stained-glass pieces imported from SVG: Curve, Curve001 ... Curve117. */
    [curve: `Curve${string}`]: THREE.Mesh
  }
  materials: {
    ['Church_Stone.007']: THREE.MeshStandardMaterial
    ['Church_Cloth.007']: THREE.MeshStandardMaterial
    ['Church_DarkWood.007']: THREE.MeshStandardMaterial
    Material: THREE.MeshStandardMaterial
    ['Church_Gold.007']: THREE.MeshStandardMaterial
    ['Church_Plaster.007']: THREE.MeshStandardMaterial
    ['Church_Glass.007']: THREE.MeshPhysicalMaterial
    ['Church_Brass.007']: THREE.MeshStandardMaterial
    ['Church_Silver.007']: THREE.MeshStandardMaterial
    ['Church_Water.007']: THREE.MeshPhysicalMaterial
    ['Church_Wax.007']: THREE.MeshStandardMaterial
  }
}

export function Church(props: ComponentProps<'group'>) {
  const roof = useChurchStore((s) => s.roof)
  const { nodes, materials } = useGLTF(MODEL_URL) as unknown as GLTFResult
  // The exported meshes have no UVs, so project them in world units (metres per texture tile).
  const grass = useMemo(() => makeGrassTextures(), [])
  const tile = useMemo(() => makeRoofTileTextures(), [])
  const slate = useMemo(() => makeSlateTextures(), [])
  const roofGeo = {
    ang: useMemo(() => withSlopeUVs(nodes.Roof_ang.geometry, 2), [nodes]),
    mid: useMemo(() => withSlopeUVs(nodes.Roof_mid.geometry, 2), [nodes]),
    orth: useMemo(() => withSlopeUVs(nodes.Roof_orth.geometry, 2), [nodes]),
    rom: useMemo(() => withSlopeUVs(nodes.Roof_rom.geometry, 2), [nodes]),
  }
  const wood = useMemo(() => makeWoodTextures(), [])
  const pewsGeo = useMemo(() => withBoxUVs(nodes.Pews.geometry, 1), [nodes])
  const groundGeo = useMemo(() => withBoxUVs(nodes.Ground.geometry, 4), [nodes])
  const curveNames = useMemo(() => Object.keys(nodes).filter((n) => /^Curve\d*$/.test(n)), [nodes])

  return (
    <group {...props} dispose={null}>
      <mesh name="Altar" visible={isNodeVisible("Altar", roof)} castShadow receiveShadow geometry={nodes.Altar.geometry} material={materials['Church_Stone.007']} />
      <mesh name="Cloth" visible={isNodeVisible("Cloth", roof)} castShadow receiveShadow geometry={nodes.Cloth.geometry} material={materials['Church_Cloth.007']} />
      <mesh name="Confess" visible={isNodeVisible("Confess", roof)} castShadow receiveShadow geometry={nodes.Confess.geometry} material={materials['Church_DarkWood.007']} />
      <mesh name="Cube" visible={isNodeVisible("Cube", roof)} castShadow receiveShadow geometry={nodes.Cube.geometry} material={materials.Material} />
      <mesh name="Dome" visible={isNodeVisible("Dome", roof)} castShadow receiveShadow geometry={nodes.Dome.geometry} material={materials['Church_Gold.007']} />
      <mesh name="Door" visible={isNodeVisible("Door", roof)} castShadow receiveShadow geometry={nodes.Door.geometry} material={materials['Church_DarkWood.007']} />
      <mesh name="Doorframe" visible={isNodeVisible("Doorframe", roof)} castShadow receiveShadow geometry={nodes.Doorframe.geometry} material={materials['Church_Stone.007']} />
      <mesh name="Floor" visible={isNodeVisible("Floor", roof)} castShadow receiveShadow geometry={nodes.Floor.geometry} material={materials['Church_Stone.007']} />
      <mesh name="Font" visible={isNodeVisible("Font", roof)} castShadow receiveShadow geometry={nodes.Font.geometry} material={materials['Church_Stone.007']} />
      <mesh name="Frontwall" visible={isNodeVisible("Frontwall", roof)} castShadow receiveShadow geometry={nodes.Frontwall.geometry} material={materials['Church_Plaster.007']} />
      <mesh name="Glass" visible={isNodeVisible("Glass", roof)} receiveShadow geometry={nodes.Glass.geometry} material={materials['Church_Glass.007']} />
      <mesh name="Gold" visible={isNodeVisible("Gold", roof)} castShadow receiveShadow geometry={nodes.Gold.geometry} material={materials['Church_Gold.007']} />
      <mesh name="Ground" visible={isNodeVisible("Ground", roof)} castShadow receiveShadow geometry={groundGeo}>
        <meshStandardMaterial map={grass.map} bumpMap={grass.bumpMap} bumpScale={3} roughness={1} />
      </mesh>
      <mesh name="Ironmongery" visible={isNodeVisible("Ironmongery", roof)} castShadow receiveShadow geometry={nodes.Ironmongery.geometry} material={materials['Church_Brass.007']} />
      <mesh name="Organ_case" visible={isNodeVisible("Organ_case", roof)} castShadow receiveShadow geometry={nodes.Organ_case.geometry} material={materials['Church_DarkWood.007']} />
      <mesh name="Organ_pipes" visible={isNodeVisible("Organ_pipes", roof)} castShadow receiveShadow geometry={nodes.Organ_pipes.geometry} material={materials['Church_Silver.007']} />
      <mesh name="Pews" visible={isNodeVisible("Pews", roof)} castShadow receiveShadow geometry={pewsGeo}>
        <meshStandardMaterial map={wood.map} bumpMap={wood.bumpMap} bumpScale={1.5} roughness={0.65} />
      </mesh>
      <mesh name="Platform" visible={isNodeVisible("Platform", roof)} castShadow receiveShadow geometry={nodes.Platform.geometry} material={materials['Church_Stone.007']} />
      <mesh name="Roof_ang" visible={isNodeVisible("Roof_ang", roof)} castShadow receiveShadow geometry={roofGeo.ang}>
        <meshStandardMaterial map={tile.map} bumpMap={tile.bumpMap} bumpScale={2} roughness={0.7} />
      </mesh>
      <mesh name="Roof_mid" visible={isNodeVisible("Roof_mid", roof)} castShadow receiveShadow geometry={roofGeo.mid}>
        <meshStandardMaterial map={slate.map} bumpMap={slate.bumpMap} bumpScale={2} roughness={0.6} />
      </mesh>
      <mesh name="Roof_orth" visible={isNodeVisible("Roof_orth", roof)} castShadow receiveShadow geometry={roofGeo.orth}>
        <meshStandardMaterial map={slate.map} bumpMap={slate.bumpMap} bumpScale={2} roughness={0.6} />
      </mesh>
      <mesh name="Roof_rom" visible={isNodeVisible("Roof_rom", roof)} castShadow receiveShadow geometry={roofGeo.rom}>
        <meshStandardMaterial map={slate.map} bumpMap={slate.bumpMap} bumpScale={2} roughness={0.6} />
      </mesh>
      <mesh name="Stand" visible={isNodeVisible("Stand", roof)} castShadow receiveShadow geometry={nodes.Stand.geometry} material={materials['Church_Brass.007']} />
      <mesh name="Walls_anglican" visible={isNodeVisible("Walls_anglican", roof)} castShadow receiveShadow geometry={nodes.Walls_anglican.geometry} material={materials['Church_Plaster.007']} />
      <mesh name="Walls_orthodox" visible={isNodeVisible("Walls_orthodox", roof)} castShadow receiveShadow geometry={nodes.Walls_orthodox.geometry} material={materials['Church_Plaster.007']} />
      <mesh name="Walls_roman" visible={isNodeVisible("Walls_roman", roof)} castShadow receiveShadow geometry={nodes.Walls_roman.geometry} material={materials['Church_Plaster.007']} />
      <mesh name="Water" visible={isNodeVisible("Water", roof)} castShadow receiveShadow geometry={nodes.Water.geometry} material={materials['Church_Water.007']} />
      <mesh name="Wax" visible={isNodeVisible("Wax", roof)} castShadow receiveShadow geometry={nodes.Wax.geometry} material={materials['Church_Wax.007']} />
      {curveNames.map((n) => {
        const mesh = nodes[n as `Curve${string}`]
        return <mesh key={n} name={n} visible={isNodeVisible(n, roof)} receiveShadow geometry={mesh.geometry} material={mesh.material} />
      })}
      <CandleFlames geometry={nodes.Flame.geometry} />
    </group>
  )
}

useGLTF.preload(MODEL_URL)
