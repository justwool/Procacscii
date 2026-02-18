import { describe, expect, it } from 'vitest';
import { mulberry32 } from '../core/rng';

describe('mulberry32', () => {
  it('is deterministic', () => {
    const a = mulberry32(123);
    const b = mulberry32(123);
    const seqA = Array.from({ length: 5 }, () => a());
    const seqB = Array.from({ length: 5 }, () => b());
    expect(seqA).toEqual(seqB);
  });
});
