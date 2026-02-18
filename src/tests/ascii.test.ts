import { describe, expect, it } from 'vitest';
import { canvasToAscii } from '../render/ascii/ascii';
import { defaultParams } from '../core/params';

function fakeCanvas(): HTMLCanvasElement {
  return {
    width: 4,
    height: 2,
    getContext: () => ({
      getImageData: (x: number) => ({ data: x < 2 ? new Uint8ClampedArray([0, 0, 0, 255]) : new Uint8ClampedArray([255, 255, 255, 255]) }),
    }),
  } as unknown as HTMLCanvasElement;
}

describe('ascii', () => {
  it('maps luminance stably', () => {
    const ascii = canvasToAscii(fakeCanvas(), { ...defaultParams.ascii, cols: 2, rows: 1, charsetRamp: ' .#', ansiEnabled: false });
    expect(ascii).toBe(' #\n');
  });
});
