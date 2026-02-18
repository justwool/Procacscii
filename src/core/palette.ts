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
  const count = randInt(rng, 3, 8);
  const contrastBoost = params.contrast * 25;
  const satBase = 58 + params.saturationBias * 30;
  const lightBase = 52 + params.brightnessBias * 25;

  const hues: number[] = [];
  for (let i = 0; i < count; i += 1) {
    if (params.hueMode === 'analogous') hues.push(baseHue + (i - count / 2) * 18);
    else if (params.hueMode === 'complement') hues.push(baseHue + (i % 2 === 0 ? 0 : 180) + i * 6);
    else if (params.hueMode === 'triad') hues.push(baseHue + (i % 3) * 120 + i * 3);
    else hues.push(baseHue + (rng() - 0.5) * 120 + i * 8);
  }

  const accents = hues.map((h, i) => hsl(h, satBase + (rng() - 0.5) * 12, lightBase + (i % 2 === 0 ? contrastBoost : -contrastBoost * 0.55)));
  const bgHue = baseHue + (pick(rng, [-40, -15, 15, 40]));
  const background = hsl(bgHue, satBase * 0.4, 12 + params.backgroundBias * 18);
  const gradientStops = accents.slice(0, 4).map((color, i, arr) => ({ t: i / Math.max(1, arr.length - 1), color }));
  return { background, accents, gradientStops };
}
