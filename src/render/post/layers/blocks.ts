import type { RNG } from '../../../core/rng';

export function applyBlocksLayer(ctx: CanvasRenderingContext2D, width: number, height: number, blockSize: number, strength: number, rng: RNG): void {
  const swaps = Math.max(1, Math.round(50 * strength));
  for (let i = 0; i < swaps; i += 1) {
    const ax = Math.floor(rng() * (width - blockSize));
    const ay = Math.floor(rng() * (height - blockSize));
    const bx = Math.floor(rng() * (width - blockSize));
    const by = Math.floor(rng() * (height - blockSize));
    const a = ctx.getImageData(ax, ay, blockSize, blockSize);
    const b = ctx.getImageData(bx, by, blockSize, blockSize);
    ctx.putImageData(a, bx, by);
    ctx.putImageData(b, ax, ay);
  }
}
