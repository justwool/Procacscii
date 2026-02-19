import type { Params } from './params';
import type { RNG } from './rng';
import { mulberry32 } from './rng';
import { fbm3 } from './noise';

export interface FieldContext {
  domainRadius: number;
  centers: [number, number, number][];
  sampleScalar: (x: number, y: number, z: number) => number;
  sampleVector: (x: number, y: number, z: number) => [number, number, number];
  spawnPoint: (rng: RNG) => [number, number, number];
}

export function createFieldContext(params: Params): FieldContext {
  const seedRng = mulberry32(params.seed ^ 0x9e3779b9);
  const domainRadius = 5.5 * params.scale;
  const centers: [number, number, number][] = [];

  if (params.compositionMode === 'single') {
    centers.push([0, 0, 0]);
  } else if (params.compositionMode === 'clustered') {
    const clusterCount = 3;
    for (let i = 0; i < clusterCount; i += 1) {
      centers.push([(seedRng() - 0.5) * domainRadius * 1.4, (seedRng() - 0.5) * domainRadius * 0.7, (seedRng() - 0.5) * domainRadius * 1.4]);
    }
  } else {
    centers.push([0, 0, 0]);
  }

  const warpStrength = 0.45 + params.bendAmount * 0.8;

  const warped = (x: number, y: number, z: number) => {
    const wx = fbm3(x * 0.24, y * 0.24, z * 0.24, params.seed + 71) - 0.5;
    const wy = fbm3(x * 0.24, y * 0.24, z * 0.24, params.seed + 131) - 0.5;
    const wz = fbm3(x * 0.24, y * 0.24, z * 0.24, params.seed + 181) - 0.5;
    return [x + wx * warpStrength, y + wy * warpStrength, z + wz * warpStrength] as const;
  };

  const sampleScalar = (x: number, y: number, z: number): number => {
    const [wx, wy, wz] = warped(x, y, z);
    return fbm3(wx * 0.35, wy * 0.35, wz * 0.35, params.seed + 17, 5);
  };

  const sampleVector = (x: number, y: number, z: number): [number, number, number] => {
    const eps = 0.05;
    const n1 = sampleScalar(x + eps, y, z) - sampleScalar(x - eps, y, z);
    const n2 = sampleScalar(x, y + eps, z) - sampleScalar(x, y - eps, z);
    const n3 = sampleScalar(x, y, z + eps) - sampleScalar(x, y, z - eps);
    const bend = params.bendAmount;
    return [n2 - n3 * bend, n3 - n1 * bend, n1 - n2 * bend];
  };

  const spawnPoint = (rng: RNG): [number, number, number] => {
    const center = centers[Math.floor(rng() * centers.length)] ?? [0, 0, 0];
    const frameBias = params.compositionMode === 'framed' ? 0.6 : 1;
    return [
      center[0] + (rng() - 0.5) * domainRadius * frameBias,
      center[1] + (rng() - 0.5) * domainRadius * 0.7 * frameBias,
      center[2] + (rng() - 0.5) * domainRadius * frameBias,
    ];
  };

  return { domainRadius, centers, sampleScalar, sampleVector, spawnPoint };
}
