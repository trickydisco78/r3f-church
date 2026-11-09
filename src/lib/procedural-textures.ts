import * as THREE from "three";

export interface TexturePair {
  map: THREE.CanvasTexture;
  bumpMap: THREE.CanvasTexture;
}

const SIZE = 512;

/** Small deterministic PRNG so textures look the same on every load. */
function rng(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function canvas() {
  const c = document.createElement("canvas");
  c.width = c.height = SIZE;
  const ctx = c.getContext("2d")!;
  return { c, ctx };
}

function toTexture(c: HTMLCanvasElement, srgb: boolean) {
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.anisotropy = 8;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/** One tile = 4 bricks wide x 8 courses high, running bond. */
export function makeBrickTextures(): TexturePair {
  const rand = rng(7);
  const col = canvas();
  const bump = canvas();
  const rows = 8;
  const perRow = 4;
  const bh = SIZE / rows;
  const bw = SIZE / perRow;
  const mortar = 5;

  col.ctx.fillStyle = "#b8b0a2"; // mortar
  col.ctx.fillRect(0, 0, SIZE, SIZE);
  bump.ctx.fillStyle = "#000";
  bump.ctx.fillRect(0, 0, SIZE, SIZE);

  for (let r = 0; r < rows; r++) {
    const offset = r % 2 ? bw / 2 : 0;
    for (let b = -1; b < perRow; b++) {
      const x = b * bw + offset;
      const y = r * bh;
      const hue = 10 + rand() * 12;
      const sat = 40 + rand() * 18;
      const lig = 32 + rand() * 14;
      col.ctx.fillStyle = `hsl(${hue} ${sat}% ${lig}%)`;
      col.ctx.fillRect(x + mortar / 2, y + mortar / 2, bw - mortar, bh - mortar);
      bump.ctx.fillStyle = "#fff";
      bump.ctx.fillRect(x + mortar / 2, y + mortar / 2, bw - mortar, bh - mortar);
    }
  }
  // speckle
  for (let i = 0; i < 6000; i++) {
    col.ctx.fillStyle = `rgba(0,0,0,${rand() * 0.08})`;
    col.ctx.fillRect(rand() * SIZE, rand() * SIZE, 2, 2);
  }
  return { map: toTexture(col.c, true), bumpMap: toTexture(bump.c, false) };
}

/** Mottled green with blade-like strokes. */
export function makeGrassTextures(): TexturePair {
  const rand = rng(21);
  const col = canvas();
  const bump = canvas();

  col.ctx.fillStyle = "#3d6b2a";
  col.ctx.fillRect(0, 0, SIZE, SIZE);
  bump.ctx.fillStyle = "#808080";
  bump.ctx.fillRect(0, 0, SIZE, SIZE);

  for (let i = 0; i < 900; i++) {
    col.ctx.fillStyle = `hsla(${85 + rand() * 40} ${35 + rand() * 25}% ${18 + rand() * 18}% / 0.35)`;
    const r = 10 + rand() * 30;
    col.ctx.beginPath();
    col.ctx.arc(rand() * SIZE, rand() * SIZE, r, 0, Math.PI * 2);
    col.ctx.fill();
  }
  for (let i = 0; i < 14000; i++) {
    const x = rand() * SIZE;
    const y = rand() * SIZE;
    const len = 4 + rand() * 9;
    const lean = (rand() - 0.5) * 4;
    col.ctx.strokeStyle = `hsl(${80 + rand() * 45} ${40 + rand() * 30}% ${20 + rand() * 30}%)`;
    col.ctx.lineWidth = 1;
    col.ctx.beginPath();
    col.ctx.moveTo(x, y);
    col.ctx.lineTo(x + lean, y - len);
    col.ctx.stroke();
    const g = Math.floor(90 + rand() * 120);
    bump.ctx.strokeStyle = `rgb(${g},${g},${g})`;
    bump.ctx.beginPath();
    bump.ctx.moveTo(x, y);
    bump.ctx.lineTo(x + lean, y - len);
    bump.ctx.stroke();
  }
  return { map: toTexture(col.c, true), bumpMap: toTexture(bump.c, false) };
}

/** Terracotta clay tiles: 8 columns x 8 rows, staggered, with a shadowed lower edge. */
export function makeRoofTileTextures(): TexturePair {
  const rand = rng(33);
  const col = canvas();
  const bump = canvas();
  const rows = 8;
  const perRow = 8;
  const th = SIZE / rows;
  const tw = SIZE / perRow;

  col.ctx.fillStyle = "#4a2418";
  col.ctx.fillRect(0, 0, SIZE, SIZE);
  bump.ctx.fillStyle = "#000";
  bump.ctx.fillRect(0, 0, SIZE, SIZE);

  for (let r = 0; r < rows; r++) {
    const offset = r % 2 ? tw / 2 : 0;
    for (let t = -1; t < perRow; t++) {
      const x = t * tw + offset;
      const y = r * th;
      col.ctx.fillStyle = `hsl(${12 + rand() * 10} ${55 + rand() * 15}% ${34 + rand() * 12}%)`;
      col.ctx.fillRect(x + 1, y + 1, tw - 2, th - 2);
      const shade = col.ctx.createLinearGradient(0, y, 0, y + th);
      shade.addColorStop(0, "rgba(0,0,0,0.35)");
      shade.addColorStop(0.35, "rgba(0,0,0,0)");
      col.ctx.fillStyle = shade;
      col.ctx.fillRect(x + 1, y + 1, tw - 2, th - 2);
      const lift = bump.ctx.createLinearGradient(0, y, 0, y + th);
      lift.addColorStop(0, "#222");
      lift.addColorStop(1, "#fff");
      bump.ctx.fillStyle = lift;
      bump.ctx.fillRect(x + 1, y + 1, tw - 2, th - 2);
    }
  }
  for (let i = 0; i < 5000; i++) {
    col.ctx.fillStyle = `rgba(0,0,0,${rand() * 0.1})`;
    col.ctx.fillRect(rand() * SIZE, rand() * SIZE, 2, 2);
  }
  return { map: toTexture(col.c, true), bumpMap: toTexture(bump.c, false) };
}

/** Dark grey slate shingles: 6 columns x 10 rows, staggered, with blue-grey variation. */
export function makeSlateTextures(): TexturePair {
  const rand = rng(55);
  const col = canvas();
  const bump = canvas();
  const rows = 10;
  const perRow = 6;
  const sh = SIZE / rows;
  const sw = SIZE / perRow;

  col.ctx.fillStyle = "#14171b";
  col.ctx.fillRect(0, 0, SIZE, SIZE);
  bump.ctx.fillStyle = "#000";
  bump.ctx.fillRect(0, 0, SIZE, SIZE);

  for (let r = 0; r < rows; r++) {
    const offset = r % 2 ? sw / 2 : 0;
    for (let t = -1; t < perRow; t++) {
      const x = t * sw + offset;
      const y = r * sh;
      col.ctx.fillStyle = `hsl(${205 + rand() * 20} ${6 + rand() * 10}% ${20 + rand() * 12}%)`;
      col.ctx.fillRect(x + 1.5, y + 1.5, sw - 3, sh - 3);
      const g = Math.floor(150 + rand() * 105);
      bump.ctx.fillStyle = `rgb(${g},${g},${g})`;
      bump.ctx.fillRect(x + 1.5, y + 1.5, sw - 3, sh - 3);
    }
  }
  for (let i = 0; i < 4000; i++) {
    col.ctx.fillStyle = `rgba(255,255,255,${rand() * 0.04})`;
    col.ctx.fillRect(rand() * SIZE, rand() * SIZE, 3, 1);
  }
  return { map: toTexture(col.c, true), bumpMap: toTexture(bump.c, false) };
}

/** Warm medium-brown wood: long wavy grain lines with a few knots and plank seams. */
export function makeWoodTextures(): TexturePair {
  const rand = rng(77);
  const col = canvas();
  const bump = canvas();
  const planks = 4;
  const pw = SIZE / planks;

  bump.ctx.fillStyle = "#808080";
  bump.ctx.fillRect(0, 0, SIZE, SIZE);

  for (let p = 0; p < planks; p++) {
    const x0 = p * pw;
    col.ctx.fillStyle = `hsl(${24 + rand() * 6} ${48 + rand() * 12}% ${30 + rand() * 8}%)`;
    col.ctx.fillRect(x0, 0, pw, SIZE);
    // grain runs vertically (along v), slightly wavy
    const phase = rand() * 10;
    for (let i = 0; i < 38; i++) {
      const gx = x0 + rand() * pw;
      const amp = 1 + rand() * 3;
      const freq = 0.01 + rand() * 0.02;
      const dark = rand() * 0.28;
      col.ctx.strokeStyle = `rgba(40,20,8,${dark})`;
      col.ctx.lineWidth = 0.6 + rand() * 1.6;
      bump.ctx.strokeStyle = `rgba(0,0,0,${dark * 1.6})`;
      bump.ctx.lineWidth = col.ctx.lineWidth;
      for (const ctx of [col.ctx, bump.ctx]) {
        ctx.beginPath();
        for (let y = 0; y <= SIZE; y += 8) {
          const x = gx + Math.sin(y * freq + phase + i) * amp;
          if (y === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }
    }
    // a knot
    if (rand() > 0.4) {
      const kx = x0 + pw * (0.25 + rand() * 0.5);
      const ky = rand() * SIZE;
      for (let r = 14; r > 2; r -= 3) {
        col.ctx.strokeStyle = `rgba(35,16,6,${0.45 - r * 0.015})`;
        col.ctx.lineWidth = 1.5;
        col.ctx.beginPath();
        col.ctx.ellipse(kx, ky, r * 0.6, r * 1.3, 0, 0, Math.PI * 2);
        col.ctx.stroke();
      }
    }
    // plank seam
    col.ctx.fillStyle = "rgba(20,10,4,0.7)";
    col.ctx.fillRect(x0, 0, 2, SIZE);
    bump.ctx.fillStyle = "#000";
    bump.ctx.fillRect(x0, 0, 2, SIZE);
  }
  return { map: toTexture(col.c, true), bumpMap: toTexture(bump.c, false) };
}
