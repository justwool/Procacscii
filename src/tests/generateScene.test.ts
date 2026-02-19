import { describe, expect, it } from 'vitest';
import { generateScene } from '../core/generateScene';
import { defaultParams } from '../core/params';
import { deriveStyle } from '../core/style';
import { mulberry32 } from '../core/rng';

function sceneHash(params = defaultParams): string {
  const style = deriveStyle(params, mulberry32(params.seed));
  const scene = generateScene(params, mulberry32(params.seed), style);
  const compact = JSON.stringify({ scene, style }, (_k, v) => (typeof v === 'number' ? Number(v.toFixed(4)) : v));
  let hash = 2166136261;
  for (let i = 0; i < compact.length; i += 1) {
    hash ^= compact.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(16);
}

describe('generateScene procedural behavior', () => {
  it('is deterministic for same params', () => {
    expect(sceneHash(defaultParams)).toEqual(sceneHash(defaultParams));
  });

  it('changes hash when key params change', () => {
    const checks = [
      { ...defaultParams, bendAmount: defaultParams.bendAmount + 0.3 },
      { ...defaultParams, lineWidth: defaultParams.lineWidth + 1.5 },
      { ...defaultParams, materialModel: 'flat' as const },
      { ...defaultParams, colorApplicationMode: 'solid' as const },
      { ...defaultParams, scale: defaultParams.scale * 1.3 },
      { ...defaultParams, compositionMode: 'framed' as const },
      { ...defaultParams, hueMode: 'triad' as const },
      { ...defaultParams, fieldStrength: defaultParams.fieldStrength * 1.6 },
    ];

    const base = sceneHash(defaultParams);
    checks.forEach((variant) => {
      expect(sceneHash(variant)).not.toEqual(base);
    });
  });

  it('scales primitive amount for mix controls', () => {
    const baseParams = { ...defaultParams, primitiveMix: { ribbons: 1, steps: 1, fieldLines: 1, blobs: 0.5 } };
    const amplifiedParams = { ...baseParams, primitiveMix: { ribbons: 3, steps: 3, fieldLines: 3, blobs: 2 } };

    const baseStyle = deriveStyle(baseParams, mulberry32(baseParams.seed));
    const amplifiedStyle = deriveStyle(amplifiedParams, mulberry32(amplifiedParams.seed));

    const baseScene = generateScene(baseParams, mulberry32(baseParams.seed), baseStyle);
    const amplifiedScene = generateScene(amplifiedParams, mulberry32(amplifiedParams.seed), amplifiedStyle);

    expect(amplifiedScene.primitives.length).toBeGreaterThanOrEqual(baseScene.primitives.length);

    const baseFieldLines = baseScene.primitives.find((p) => p.kind === 'fieldLines');
    const amplifiedFieldLines = amplifiedScene.primitives.find((p) => p.kind === 'fieldLines');
    expect(baseFieldLines?.kind).toBe('fieldLines');
    expect(amplifiedFieldLines?.kind).toBe('fieldLines');
    if (baseFieldLines?.kind === 'fieldLines' && amplifiedFieldLines?.kind === 'fieldLines') {
      expect(amplifiedFieldLines.data.lines.length).toBeGreaterThan(baseFieldLines.data.lines.length);
    }
  });
});
