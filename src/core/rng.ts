export type RNG = () => number;

export function mulberry32(seed: number): RNG {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export function randRange(rng: RNG, min: number, max: number): number {
  return min + (max - min) * rng();
}

export function randInt(rng: RNG, min: number, max: number): number {
  return Math.floor(randRange(rng, min, max + 1));
}

export function pick<T>(rng: RNG, list: readonly T[]): T {
  return list[Math.floor(rng() * list.length)] ?? list[0];
}
