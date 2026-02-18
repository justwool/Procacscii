export function applyWarpLayer(ctx: CanvasRenderingContext2D, width: number, height: number, strength: number): void {
  const src = ctx.getImageData(0, 0, width, height);
  const dst = ctx.createImageData(width, height);
  const amp = Math.max(1, Math.floor(8 * strength));
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const sx = Math.max(0, Math.min(width - 1, x + Math.floor(Math.sin(y * 0.03) * amp)));
      const sy = Math.max(0, Math.min(height - 1, y + Math.floor(Math.cos(x * 0.02) * amp)));
      const si = (sy * width + sx) * 4;
      const di = (y * width + x) * 4;
      dst.data[di] = src.data[si];
      dst.data[di + 1] = src.data[si + 1];
      dst.data[di + 2] = src.data[si + 2];
      dst.data[di + 3] = src.data[si + 3];
    }
  }
  ctx.putImageData(dst, 0, 0);
}
