import { describe, expect, it } from 'vitest';
import { defaultParams } from '../core/params';
import { generatePalette } from '../core/palette';

describe('palette', () => {
  it('is deterministic and bounded', () => {
    const p1 = generatePalette(99, defaultParams);
    const p2 = generatePalette(99, defaultParams);
    expect(p1).toEqual(p2);
    expect(p1.accents.length).toBeGreaterThanOrEqual(3);
    expect(p1.accents.length).toBeLessThanOrEqual(8);
    [...p1.accents, p1.background].forEach((c) => expect(c).toMatch(/^hsl\(/));
    expect(Number.isNaN(p1.gradientStops[0]?.t ?? 0)).toBe(false);
  });
});
