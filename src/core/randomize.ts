import type { Params } from './params';
import { mulberry32 } from './rng';

function randomSeed(): number {
  return Math.floor(Math.random() * 0xffffffff) >>> 0;
}

export function randomizeParams(base: Params, seedOverride?: number): Params {
  const nextSeed = seedOverride ?? randomSeed();
  const rng = mulberry32(nextSeed ^ base.seed);

  const weight = () => Number((0.2 + rng() * 3.8).toFixed(2));

  return {
    ...base,
    seed: nextSeed,
    primitiveMix: {
      ribbons: weight(),
      steps: weight(),
      fieldLines: weight(),
      blobs: Number((rng() * 3).toFixed(2)),
    },
    density: Number((0.2 + rng() * 1.6).toFixed(2)),
    lineCount: Math.floor(40 + rng() * 260),
    stepsPerLine: Math.floor(32 + rng() * 160),
    fieldStrength: Number((0.01 + rng() * 0.07).toFixed(4)),
    jitter: Number((rng() * 0.05).toFixed(4)),
    terraceStrength: Number((rng() * 0.8).toFixed(2)),
    paletteSeedOffset: Math.floor(rng() * 5000),
    backgroundBias: Number((-0.35 + rng() * 0.7).toFixed(2)),
    post: {
      ...base.post,
      framing: { ...base.post.framing, enabled: rng() > 0.2, strength: Number((rng()).toFixed(2)) },
      tiling: { ...base.post.tiling, enabled: rng() > 0.65, strength: Number((rng()).toFixed(2)) },
      blocks: { ...base.post.blocks, enabled: rng() > 0.35, strength: Number((rng()).toFixed(2)) },
      warp: { ...base.post.warp, enabled: rng() > 0.55, strength: Number((rng()).toFixed(2)) },
    },
  };
}
