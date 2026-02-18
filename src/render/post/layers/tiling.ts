export function applyTilingLayer(ctx: CanvasRenderingContext2D, width: number, height: number, mode: '2x2' | 'vertical'): void {
  const snapshot = ctx.getImageData(0, 0, width, height);
  const c = document.createElement('canvas');
  c.width = width;
  c.height = height;
  c.getContext('2d')?.putImageData(snapshot, 0, 0);
  if (mode === 'vertical') {
    ctx.drawImage(c, 0, 0, width / 2, height, 0, 0, width / 2, height);
    ctx.drawImage(c, width / 2, 0, width / 2, height, width / 2, 0, width / 2, height);
    return;
  }
  for (let y = 0; y < 2; y += 1) {
    for (let x = 0; x < 2; x += 1) {
      ctx.drawImage(c, 0, 0, width, height, x * width * 0.5, y * height * 0.5, width * 0.5, height * 0.5);
    }
  }
}
