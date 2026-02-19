import { mulberry32, pick, randInt } from './rng';
import type { Params } from './params';

export interface PaletteStop {
  t: number;
  color: string;
}

export interface GeneratedPalette {
  background: string;
  accents: string[];
  gradientStops: PaletteStop[];
}

function hsl(h: number, s: number, l: number): string {
  const hh = ((h % 360) + 360) % 360;
  const ss = Math.max(0, Math.min(100, s));
  const ll = Math.max(0, Math.min(100, l));
  return `hsl(${hh.toFixed(1)} ${ss.toFixed(1)}% ${ll.toFixed(1)}%)`;
}

export function generatePalette(seed: number, params: Params): GeneratedPalette {
  const rng = mulberry32(seed + params.paletteSeedOffset);
  const baseHue = rng() * 360;
  const count = randInt(rng, 4, 9);
  const contrastBoost = 14 + params.contrast * 36;
  const satBase = 56 + params.saturationBias * 34;
  const lightBase = 50 + params.brightnessBias * 28;

  const hues: number[] = [];
  for (let i = 0; i < count; i += 1) {
    if (params.hueMode === 'analogous') hues.push(baseHue + (i - count / 2) * 26);
    else if (params.hueMode === 'complement') hues.push(baseHue + (i % 2 === 0 ? 0 : 180) + i * 11);
    else if (params.hueMode === 'triad') hues.push(baseHue + (i % 3) * 120 + i * 8);
    else hues.push(baseHue + (rng() - 0.5) * 220 + i * 15);
  }

  const accents = hues.map((h, i) => hsl(h, satBase + (rng() - 0.5) * 18, lightBase + (i % 2 === 0 ? contrastBoost : -contrastBoost * 0.75)));
  const bgHue = baseHue + pick(rng, [-60, -28, 28, 60]);
  const background = hsl(bgHue, satBase * 0.35, 10 + params.backgroundBias * 22);
  const gradientStops = accents.slice(0, 5).map((color, i, arr) => ({ t: i / Math.max(1, arr.length - 1), color }));
  return { background, accents, gradientStops };
}
