import type { Params } from '../../core/params';
import { mulberry32 } from '../../core/rng';
import { applyBlocksLayer } from './layers/blocks';
import { applyFrameLayer } from './layers/frame';
import { applyTilingLayer } from './layers/tiling';
import { applyWarpLayer } from './layers/warp';

export function runPostLayers(baseCanvas: HTMLCanvasElement, params: Params): HTMLCanvasElement {
  const out = document.createElement('canvas');
  out.width = baseCanvas.width;
  out.height = baseCanvas.height;
  const ctx = out.getContext('2d');
  if (!ctx) return out;
  ctx.drawImage(baseCanvas, 0, 0);

  if (!params.post.postEnabled) return out;
  const rng = mulberry32(params.seed + 991);
  const { framing, tiling, blocks, warp } = params.post;

  if (framing.enabled && rng() <= framing.probability) applyFrameLayer(ctx, out.width, out.height, framing.strength);
  if (tiling.enabled && rng() <= tiling.probability) applyTilingLayer(ctx, out.width, out.height, tiling.mode);
  if (blocks.enabled && rng() <= blocks.probability) applyBlocksLayer(ctx, out.width, out.height, blocks.blockSize, blocks.strength, rng);
  if (warp.enabled && rng() <= warp.probability) applyWarpLayer(ctx, out.width, out.height, warp.strength);

  return out;
}
