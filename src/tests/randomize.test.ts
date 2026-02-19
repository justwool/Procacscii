import { describe, expect, it } from 'vitest';
import { defaultParams } from '../core/params';
import { randomizeParams } from '../core/randomize';

describe('randomizeParams', () => {
  it('is deterministic for the same override seed', () => {
    expect(randomizeParams(defaultParams, 1234)).toEqual(randomizeParams(defaultParams, 1234));
  });

  it('changes meaningful procedural controls', () => {
    const randomized = randomizeParams(defaultParams, 9876);
    expect(randomized.seed).toBe(9876);
    expect(randomized.lineCount).not.toBe(defaultParams.lineCount);
    expect(randomized.primitiveMix.ribbons).not.toBe(defaultParams.primitiveMix.ribbons);
    expect(randomized.paletteSeedOffset).not.toBe(defaultParams.paletteSeedOffset);
  });
});
