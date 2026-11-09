/*
Based on gltfjsx output for the stained-glass model:
  npx gltfjsx@6.5.3 public/models/churchv-stained.glb --types --shadows
then hand-modified. Do NOT regenerate over this file; instead re-run gltfjsx to a scratch
file and diff node/material names. Hand edits:
  - roof visibility toggle (isNodeVisible)
  - procedural textures + projected UVs for roof, pews and ground (those meshes have no UVs)
  - roof crosses split out of the merged Gold mesh (Gold_roof) so they hide with the roof
  - gable-end panels the model is missing under the Anglican roof (GableEnds)
  - candle flames (CandleFlames)
  - the coloured glass casts shadows so sunlight is only coloured by it (see WindowLight)
  - the 100+ decorative `Curve###` meshes are rendered in a loop with the file's own materials
  - the GLB's cameras are not rendered; camera views come from src/data/cameras.json
The model is Draco-compressed; drei's useGLTF loads the decoder automatically.
*/

import * as THREE from 'three'
import { useMemo, type ComponentProps } from 'react'
import { isNodeVisible, useChurchStore } from '@/store/church-store'
import { CandleFlames } from './CandleFlames'
import { GableEnds } from './GableEnds'
import { withBoxUVs, withSlopeUVs } from '@/lib/box-uv'
import { splitByHeight } from '@/lib/split-geometry'
import { makeGrassTextures, makeRoofTileTextures, makeSlateTextures, makeWoodTextures } from '@/lib/procedural-textures'
import { useGLTF } from '@react-three/drei'
import type { GLTF } from 'three-stdlib'

const MODEL_URL = '/models/churchv-stained.glb'
/** Gold above this height (m) is the roof crosses; everything below is furnishings inside. */
const ROOF_CROSS_MIN_Y = 7.5

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
    Gold: THREE.Mesh
    Ground: THREE.Mesh
    Ironmongery: THREE.Mesh
    Lead_cames: THREE.Mesh
    Organ_case: THREE.Mesh
    Organ_pipes: THREE.Mesh
    Pews: THREE.Mesh
    Platform: THREE.Mesh
    Roof_ang: THREE.Mesh
    Roof_mid: THREE.Mesh
    Roof_orth: THREE.Mesh
    Roof_rom: THREE.Mesh
    StainedGlass_amber: THREE.Mesh
    StainedGlass_cobalt: THREE.Mesh
    StainedGlass_emerald: THREE.Mesh
    StainedGlass_ruby: THREE.Mesh
    StainedGlass_teal: THREE.Mesh
    StainedGlass_violet: THREE.Mesh
    Stand: THREE.Mesh
    Walls_anglican: THREE.Mesh
    Walls_orthodox: THREE.Mesh
    Walls_roman: THREE.Mesh
    Water: THREE.Mesh
    Wax: THREE.Mesh
    /** Decorative pieces imported from SVG: Curve, Curve001 ... Curve117. */
    [curve: `Curve${string}`]: THREE.Mesh
  }
  materials: {
    Church_Stone: THREE.MeshStandardMaterial
    Church_Cloth: THREE.MeshStandardMaterial
    Church_DarkWood: THREE.MeshStandardMaterial
    Material: THREE.MeshStandardMaterial
    Church_Gold: THREE.MeshStandardMaterial
    Church_Plaster: THREE.MeshStandardMaterial
    Church_Brass: THREE.MeshStandardMaterial
    Church_SG_lead: THREE.MeshStandardMaterial
    Church_Silver: THREE.MeshStandardMaterial
    Church_SG_amber: THREE.MeshStandardMaterial
    Church_SG_cobalt: THREE.MeshStandardMaterial
    Church_SG_emerald: THREE.MeshStandardMaterial
    Church_SG_ruby: THREE.MeshStandardMaterial
    Church_SG_teal: THREE.MeshStandardMaterial
    Church_SG_violet: THREE.MeshStandardMaterial
    Church_Water: THREE.MeshPhysicalMaterial
    Church_Wax: THREE.MeshStandardMaterial
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
  // The crosses are merged into the Gold mesh; split them out so they hide with the roof.
  const [goldGeo, roofCrossGeo] = useMemo(() => splitByHeight(nodes.Gold.geometry, ROOF_CROSS_MIN_Y), [nodes])
  const groundGeo = useMemo(() => withBoxUVs(nodes.Ground.geometry, 4), [nodes])
  const curveNames = useMemo(() => Object.keys(nodes).filter((n) => /^Curve\d*$/.test(n)), [nodes])

  return (
    <group {...props} dispose={null}>
      <mesh name="Altar" visible={isNodeVisible("Altar", roof)} castShadow receiveShadow geometry={nodes.Altar.geometry} material={materials.Church_Stone} />
      <mesh name="Cloth" visible={isNodeVisible("Cloth", roof)} castShadow receiveShadow geometry={nodes.Cloth.geometry} material={materials.Church_Cloth} />
      <mesh name="Confess" visible={isNodeVisible("Confess", roof)} castShadow receiveShadow geometry={nodes.Confess.geometry} material={materials.Church_DarkWood} />
      <mesh name="Cube" visible={isNodeVisible("Cube", roof)} castShadow receiveShadow geometry={nodes.Cube.geometry} material={materials.Material} />
      <mesh name="Dome" visible={isNodeVisible("Dome", roof)} castShadow receiveShadow geometry={nodes.Dome.geometry} material={materials.Church_Gold} />
      <mesh name="Door" visible={isNodeVisible("Door", roof)} castShadow receiveShadow geometry={nodes.Door.geometry} material={materials.Church_DarkWood} />
      <mesh name="Doorframe" visible={isNodeVisible("Doorframe", roof)} castShadow receiveShadow geometry={nodes.Doorframe.geometry} material={materials.Church_Stone} />
      <mesh name="Floor" visible={isNodeVisible("Floor", roof)} castShadow receiveShadow geometry={nodes.Floor.geometry} material={materials.Church_Stone} />
      <mesh name="Font" visible={isNodeVisible("Font", roof)} castShadow receiveShadow geometry={nodes.Font.geometry} material={materials.Church_Stone} />
      <mesh name="Frontwall" visible={isNodeVisible("Frontwall", roof)} castShadow receiveShadow geometry={nodes.Frontwall.geometry} material={materials.Church_Plaster} />
      <mesh name="Gold" visible={isNodeVisible("Gold", roof)} castShadow receiveShadow geometry={goldGeo} material={materials.Church_Gold} />
      <mesh name="Gold_roof" visible={isNodeVisible("Gold_roof", roof)} castShadow receiveShadow geometry={roofCrossGeo} material={materials.Church_Gold} />
      <mesh name="Ground" visible={isNodeVisible("Ground", roof)} castShadow receiveShadow geometry={groundGeo}>
        <meshStandardMaterial map={grass.map} bumpMap={grass.bumpMap} bumpScale={3} roughness={1} />
      </mesh>
      <mesh name="Ironmongery" visible={isNodeVisible("Ironmongery", roof)} castShadow receiveShadow geometry={nodes.Ironmongery.geometry} material={materials.Church_Brass} />
      <mesh name="Lead_cames" visible={isNodeVisible("Lead_cames", roof)} castShadow receiveShadow geometry={nodes.Lead_cames.geometry} material={materials.Church_SG_lead} />
      <mesh name="StainedGlass_amber" visible={isNodeVisible("StainedGlass_amber", roof)} castShadow receiveShadow geometry={nodes.StainedGlass_amber.geometry} material={materials.Church_SG_amber} />
      <mesh name="StainedGlass_cobalt" visible={isNodeVisible("StainedGlass_cobalt", roof)} castShadow receiveShadow geometry={nodes.StainedGlass_cobalt.geometry} material={materials.Church_SG_cobalt} />
      <mesh name="StainedGlass_emerald" visible={isNodeVisible("StainedGlass_emerald", roof)} castShadow receiveShadow geometry={nodes.StainedGlass_emerald.geometry} material={materials.Church_SG_emerald} />
      <mesh name="StainedGlass_ruby" visible={isNodeVisible("StainedGlass_ruby", roof)} castShadow receiveShadow geometry={nodes.StainedGlass_ruby.geometry} material={materials.Church_SG_ruby} />
      <mesh name="StainedGlass_teal" visible={isNodeVisible("StainedGlass_teal", roof)} castShadow receiveShadow geometry={nodes.StainedGlass_teal.geometry} material={materials.Church_SG_teal} />
      <mesh name="StainedGlass_violet" visible={isNodeVisible("StainedGlass_violet", roof)} castShadow receiveShadow geometry={nodes.StainedGlass_violet.geometry} material={materials.Church_SG_violet} />
      <mesh name="Organ_case" visible={isNodeVisible("Organ_case", roof)} castShadow receiveShadow geometry={nodes.Organ_case.geometry} material={materials.Church_DarkWood} />
      <mesh name="Organ_pipes" visible={isNodeVisible("Organ_pipes", roof)} castShadow receiveShadow geometry={nodes.Organ_pipes.geometry} material={materials.Church_Silver} />
      <mesh name="Pews" visible={isNodeVisible("Pews", roof)} castShadow receiveShadow geometry={pewsGeo}>
        <meshStandardMaterial map={wood.map} bumpMap={wood.bumpMap} bumpScale={1.5} roughness={0.65} />
      </mesh>
      <mesh name="Platform" visible={isNodeVisible("Platform", roof)} castShadow receiveShadow geometry={nodes.Platform.geometry} material={materials.Church_Stone} />
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
      <mesh name="Stand" visible={isNodeVisible("Stand", roof)} castShadow receiveShadow geometry={nodes.Stand.geometry} material={materials.Church_Brass} />
      <mesh name="Walls_anglican" visible={isNodeVisible("Walls_anglican", roof)} castShadow receiveShadow geometry={nodes.Walls_anglican.geometry} material={materials.Church_Plaster} />
      <mesh name="Walls_orthodox" visible={isNodeVisible("Walls_orthodox", roof)} castShadow receiveShadow geometry={nodes.Walls_orthodox.geometry} material={materials.Church_Plaster} />
      <mesh name="Walls_roman" visible={isNodeVisible("Walls_roman", roof)} castShadow receiveShadow geometry={nodes.Walls_roman.geometry} material={materials.Church_Plaster} />
      <mesh name="Water" visible={isNodeVisible("Water", roof)} castShadow receiveShadow geometry={nodes.Water.geometry} material={materials.Church_Water} />
      <mesh name="Wax" visible={isNodeVisible("Wax", roof)} castShadow receiveShadow geometry={nodes.Wax.geometry} material={materials.Church_Wax} />
      {curveNames.map((n) => {
        const mesh = nodes[n as `Curve${string}`]
        return <mesh key={n} name={n} visible={isNodeVisible(n, roof)} receiveShadow geometry={mesh.geometry} material={mesh.material} />
      })}
      <GableEnds roofGeometry={nodes.Roof_ang.geometry} material={materials.Church_Plaster} />
      <CandleFlames geometry={nodes.Flame.geometry} />
    </group>
  )
}

useGLTF.preload(MODEL_URL)
