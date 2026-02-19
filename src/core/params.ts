export type HueMode = 'analogous' | 'complement' | 'triad' | 'random-walk';
export type MaterialModel = 'flat' | 'lambert' | 'pbr';
export type ColorApplicationMode = 'solid' | 'strata' | 'gradient';

export interface PrimitiveMix {
  ribbons: number;
  steps: number;
  fieldLines: number;
  blobs: number;
}

export interface PostLayerOptions {
  enabled: boolean;
  strength: number;
  probability: number;
}

export interface PostSettings {
  postEnabled: boolean;
  framing: PostLayerOptions;
  tiling: PostLayerOptions & { mode: '2x2' | 'vertical' };
  blocks: PostLayerOptions & { blockSize: number };
  warp: PostLayerOptions;
}

export interface ASCIISettings {
  cols: number;
  rows: number;
  charsetRamp: string;
  invert: boolean;
  ansiEnabled: boolean;
  ansiPaletteMode: 'xterm256' | '16color';
  colorSample: 'cellAverage';
  asciiSamplePost: boolean;
}

export interface Params {
  seed: number;
  paletteSeedOffset: number;
  hueMode: HueMode;
  contrast: number;
  brightnessBias: number;
  saturationBias: number;
  materialModel: MaterialModel;
  roughness: number;
  metalness: number;
  rimLightStrength: number;
  fogStrength: number;
  colorApplicationMode: ColorApplicationMode;
  terraceStrength: number;
  stepCount: number;
  stepHeight: number;
  stepDepth: number;
  bendAmount: number;
  taper: number;
  spacing: number;
  lineCount: number;
  stepsPerLine: number;
  fieldStrength: number;
  jitter: number;
  lineWidth: number;
  density: number;
  scale: number;
  compositionMode: 'single' | 'clustered' | 'framed';
  primitiveMix: PrimitiveMix;
  cameraPreset: 'near' | 'mid' | 'far';
  backgroundBias: number;
  renderMode: 'Off' | 'ASCII Overlay';
  post: PostSettings;
  ascii: ASCIISettings;
  pngExportPost: boolean;
}

export const defaultParams: Params = {
  seed: 1337,
  paletteSeedOffset: 19,
  hueMode: 'analogous',
  contrast: 0.65,
  brightnessBias: 0,
  saturationBias: 0.1,
  materialModel: 'lambert',
  roughness: 0.45,
  metalness: 0.2,
  rimLightStrength: 0.35,
  fogStrength: 0.2,
  colorApplicationMode: 'gradient',
  terraceStrength: 0.2,
  stepCount: 18,
  stepHeight: 0.28,
  stepDepth: 0.85,
  bendAmount: 0.4,
  taper: 0.3,
  spacing: 0.1,
  lineCount: 140,
  stepsPerLine: 80,
  fieldStrength: 0.03,
  jitter: 0.012,
  lineWidth: 1,
  density: 0.7,
  scale: 1,
  compositionMode: 'clustered',
  primitiveMix: { ribbons: 1, steps: 1, fieldLines: 1, blobs: 0 },
  cameraPreset: 'mid',
  backgroundBias: 0,
  renderMode: 'Off',
  post: {
    postEnabled: true,
    framing: { enabled: true, strength: 0.5, probability: 1 },
    tiling: { enabled: false, strength: 0.5, probability: 1, mode: '2x2' },
    blocks: { enabled: true, strength: 0.2, probability: 0.4, blockSize: 18 },
    warp: { enabled: false, strength: 0.2, probability: 1 },
  },
  ascii: {
    cols: 120,
    rows: 60,
    charsetRamp: ' .:-=+*#%@',
    invert: false,
    ansiEnabled: false,
    ansiPaletteMode: 'xterm256',
    colorSample: 'cellAverage',
    asciiSamplePost: true,
  },
  pngExportPost: true,
};
