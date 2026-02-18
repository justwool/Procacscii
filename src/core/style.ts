import type { Params } from './params';
import { generatePalette, type GeneratedPalette } from './palette';
import type { RNG } from './rng';

export interface StyleSpec {
  palette: GeneratedPalette;
  materialModel: Params['materialModel'];
  rimLightStrength: number;
  fogStrength: number;
  roughness: number;
  metalness: number;
  colorApplicationMode: Params['colorApplicationMode'];
}

export function deriveStyle(params: Params, _rng: RNG): StyleSpec {
  return {
    palette: generatePalette(params.seed, params),
    materialModel: params.materialModel,
    rimLightStrength: params.rimLightStrength,
    fogStrength: params.fogStrength,
    roughness: params.roughness,
    metalness: params.metalness,
    colorApplicationMode: params.colorApplicationMode,
  };
}
