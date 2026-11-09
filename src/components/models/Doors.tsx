"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useCursor } from "@react-three/drei";
import { splitBy } from "@/lib/split-geometry";

/**
 * The front double door. The model has the two leaves swung open 90 degrees inwards (hinged at the
 * frame jambs, handles on the free ends), and no closed pose. This splits the merged `Door` and
 * `Ironmongery` meshes into a left and a right leaf, pivots each about its hinge, starts them
 * closed, and swings them open and shut when clicked.
 */

/** Mid-plane of the door frame / wall (frame spans z 7.17 to 7.73): where the closed leaves sit. */
const FRAME_CENTRE_Z = 7.45;
/** x where the two closed leaves meet (the middle of the frame opening). */
const OPENING_CENTRE_X = -0.06;
const OPEN_DAMPING = 4;

type Side = "left" | "right";

interface Leaf {
  door: THREE.BufferGeometry;
  handles: THREE.BufferGeometry;
  pivot: [number, number, number];
}

/** Door and handle geometry for one leaf, re-centred on its hinge so it can rotate about it. */
function makeLeaf(door: THREE.BufferGeometry, handles: THREE.BufferGeometry, side: Side): Leaf {
  const box = new THREE.Box3().setFromBufferAttribute(door.getAttribute("position") as THREE.BufferAttribute);
  const thickness = box.max.x - box.min.x;
  const length = box.max.z - box.min.z;
  // Open pose: the leaf runs inwards (-z) from its hinge edge, which is on the frame jamb.
  const hingeX = side === "left" ? box.min.x : box.max.x;
  const hingeEndZ = box.max.z;
  // Stretch the leaf a little so the two closed leaves meet in the middle instead of leaving a gap.
  const stretch = Math.abs(hingeX - OPENING_CENTRE_X) / length;
  const toLocal = (g: THREE.BufferGeometry) => {
    const c = g.clone();
    c.translate(-hingeX, 0, -hingeEndZ);
    c.scale(1, 1, stretch);
    return c;
  };
  return {
    door: toLocal(door),
    handles: toLocal(handles),
    // Closed, the leaf's thickness runs along z, so centre that on the frame mid-plane.
    pivot: [hingeX, 0, FRAME_CENTRE_Z - thickness / 2],
  };
}

interface DoorsProps {
  doorGeometry: THREE.BufferGeometry;
  handleGeometry: THREE.BufferGeometry;
  doorMaterial: THREE.Material;
  handleMaterial: THREE.Material;
}

export function Doors({ doorGeometry, handleGeometry, doorMaterial, handleMaterial }: DoorsProps) {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const leaves = useMemo(() => {
    const isLeft = (x: number) => x < OPENING_CENTRE_X;
    const [doorR, doorL] = splitBy(doorGeometry, (x) => isLeft(x));
    const [handleR, handleL] = splitBy(handleGeometry, (x) => isLeft(x));
    return {
      left: makeLeaf(doorL, handleL, "left"),
      right: makeLeaf(doorR, handleR, "right"),
    };
  }, [doorGeometry, handleGeometry]);

  useEffect(
    () => () => {
      for (const l of [leaves.left, leaves.right]) {
        l.door.dispose();
        l.handles.dispose();
      }
    },
    [leaves],
  );

  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const openness = useRef(0); // 0 closed .. 1 open

  useFrame((_, delta) => {
    openness.current = THREE.MathUtils.damp(openness.current, open ? 1 : 0, OPEN_DAMPING, delta);
    const swing = (Math.PI / 2) * (1 - openness.current);
    if (left.current) left.current.rotation.y = -swing;
    if (right.current) right.current.rotation.y = swing;
  });

  const handlers = {
    onClick: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setOpen((o) => !o);
    },
    onPointerOver: (e: { stopPropagation: () => void }) => {
      e.stopPropagation();
      setHovered(true);
    },
    onPointerOut: () => setHovered(false),
  };

  const renderLeaf = (side: Side, leaf: Leaf, ref: React.RefObject<THREE.Group | null>) => (
    <group ref={ref} name={`Door_${side}`} position={leaf.pivot} rotation-y={side === "left" ? -Math.PI / 2 : Math.PI / 2} {...handlers}>
      <mesh castShadow receiveShadow geometry={leaf.door} material={doorMaterial} />
      <mesh castShadow receiveShadow geometry={leaf.handles} material={handleMaterial} />
    </group>
  );

  return (
    <group name="Doors">
      {renderLeaf("left", leaves.left, left)}
      {renderLeaf("right", leaves.right, right)}
    </group>
  );
}
