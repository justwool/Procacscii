import { describe, expect, it } from 'vitest';
import { generateScene } from '../core/generateScene';
import { defaultParams } from '../core/params';
import { deriveStyle } from '../core/style';
import { mulberry32 } from '../core/rng';

describe('generateScene primitiveMix intensity', () => {
  it('scales primitive amount for ribbons, steps, and field lines', () => {
    const baseParams = {
      ...defaultParams,
      primitiveMix: {
        ribbons: 1,
        steps: 1,
        fieldLines: 1,
        blobs: 0,
      },
    };

    const amplifiedParams = {
      ...baseParams,
      primitiveMix: {
        ...baseParams.primitiveMix,
        ribbons: 3,
        steps: 3,
        fieldLines: 3,
      },
    };

    const baseStyle = deriveStyle(baseParams, mulberry32(baseParams.seed));
    const amplifiedStyle = deriveStyle(amplifiedParams, mulberry32(amplifiedParams.seed));

    const baseScene = generateScene(baseParams, mulberry32(baseParams.seed), baseStyle);
    const amplifiedScene = generateScene(amplifiedParams, mulberry32(amplifiedParams.seed), amplifiedStyle);

    const baseRibbons = baseScene.primitives.filter((p) => p.kind === 'ribbons');
    const amplifiedRibbons = amplifiedScene.primitives.filter((p) => p.kind === 'ribbons');
    expect(amplifiedRibbons.length).toBeGreaterThan(baseRibbons.length);

    const baseSteps = baseScene.primitives.find((p) => p.kind === 'steps');
    const amplifiedSteps = amplifiedScene.primitives.find((p) => p.kind === 'steps');
    expect(baseSteps?.kind).toBe('steps');
    expect(amplifiedSteps?.kind).toBe('steps');
    if (baseSteps?.kind === 'steps' && amplifiedSteps?.kind === 'steps') {
      expect(amplifiedSteps.data.levels).toBeGreaterThan(baseSteps.data.levels);
    }

    const baseFieldLines = baseScene.primitives.find((p) => p.kind === 'fieldLines');
    const amplifiedFieldLines = amplifiedScene.primitives.find((p) => p.kind === 'fieldLines');
    expect(baseFieldLines?.kind).toBe('fieldLines');
    expect(amplifiedFieldLines?.kind).toBe('fieldLines');
    if (baseFieldLines?.kind === 'fieldLines' && amplifiedFieldLines?.kind === 'fieldLines') {
      expect(amplifiedFieldLines.data.lines.length).toBeGreaterThan(baseFieldLines.data.lines.length);
    }
  });
});
