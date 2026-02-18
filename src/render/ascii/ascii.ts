import type { ASCIISettings } from '../../core/params';

interface RGB { r: number; g: number; b: number }

function luminance({ r, g, b }: RGB): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function rgbToAnsi16({ r, g, b }: RGB): number {
  const bright = luminance({ r, g, b }) > 160 ? 60 : 0;
  const idx = (r > 127 ? 1 : 0) + (g > 127 ? 2 : 0) + (b > 127 ? 4 : 0);
  return 30 + (idx % 8) + bright;
}

function rgbToAnsi256({ r, g, b }: RGB): number {
  const rr = Math.round((r / 255) * 5);
  const gg = Math.round((g / 255) * 5);
  const bb = Math.round((b / 255) * 5);
  return 16 + 36 * rr + 6 * gg + bb;
}

export function canvasToAscii(canvas: HTMLCanvasElement, options: ASCIISettings): string {
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';
  const { cols, rows } = options;
  const cw = canvas.width / cols;
  const ch = canvas.height / rows;
  const ramp = options.charsetRamp;
  let out = '';

  for (let y = 0; y < rows; y += 1) {
    let activeAnsi: number | null = null;
    for (let x = 0; x < cols; x += 1) {
      const sx = Math.floor(x * cw);
      const sy = Math.floor(y * ch);
      const data = ctx.getImageData(sx, sy, Math.max(1, Math.floor(cw)), Math.max(1, Math.floor(ch))).data;
      let r = 0;
      let g = 0;
      let b = 0;
      const n = data.length / 4;
      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }
      const rgb = { r: r / n, g: g / n, b: b / n };
      const lum = luminance(rgb) / 255;
      const mapped = options.invert ? 1 - lum : lum;
      const idx = Math.min(ramp.length - 1, Math.max(0, Math.floor(mapped * ramp.length)));
      if (options.ansiEnabled) {
        const code = options.ansiPaletteMode === '16color' ? rgbToAnsi16(rgb) : rgbToAnsi256(rgb);
        if (code !== activeAnsi) {
          out += options.ansiPaletteMode === '16color' ? `\u001b[${code}m` : `\u001b[38;5;${code}m`;
          activeAnsi = code;
        }
      }
      out += ramp[idx];
    }
    if (options.ansiEnabled) out += '\u001b[0m';
    out += '\n';
  }

  return out;
}
