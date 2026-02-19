function fract(value: number): number {
  return value - Math.floor(value);
}

function hash3(x: number, y: number, z: number, seed: number): number {
  const n = x * 157.31 + y * 311.7 + z * 911.93 + seed * 101.37;
  return fract(Math.sin(n) * 43758.5453123);
}

function smooth(t: number): number {
  return t * t * (3 - 2 * t);
}

export function valueNoise3D(x: number, y: number, z: number, seed: number): number {
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const z0 = Math.floor(z);
  const x1 = x0 + 1;
  const y1 = y0 + 1;
  const z1 = z0 + 1;

  const tx = smooth(x - x0);
  const ty = smooth(y - y0);
  const tz = smooth(z - z0);

  const c000 = hash3(x0, y0, z0, seed);
  const c100 = hash3(x1, y0, z0, seed);
  const c010 = hash3(x0, y1, z0, seed);
  const c110 = hash3(x1, y1, z0, seed);
  const c001 = hash3(x0, y0, z1, seed);
  const c101 = hash3(x1, y0, z1, seed);
  const c011 = hash3(x0, y1, z1, seed);
  const c111 = hash3(x1, y1, z1, seed);

  const x00 = c000 * (1 - tx) + c100 * tx;
  const x10 = c010 * (1 - tx) + c110 * tx;
  const x01 = c001 * (1 - tx) + c101 * tx;
  const x11 = c011 * (1 - tx) + c111 * tx;

  const y0m = x00 * (1 - ty) + x10 * ty;
  const y1m = x01 * (1 - ty) + x11 * ty;

  return y0m * (1 - tz) + y1m * tz;
}

export function fbm3(x: number, y: number, z: number, seed: number, octaves = 4): number {
  let amp = 0.5;
  let freq = 1;
  let sum = 0;
  let norm = 0;

  for (let i = 0; i < octaves; i += 1) {
    sum += valueNoise3D(x * freq, y * freq, z * freq, seed + i * 31) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2;
  }

  return norm > 0 ? sum / norm : 0;
}
