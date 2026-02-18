import * as THREE from 'three';
import type { PrimitiveModule, PrimitiveSpec } from './types';
import { randInt, randRange } from '../core/rng';

const ribbons: PrimitiveModule<'ribbons'> = {
  generate: (params, rng, style) => {
    const count = Math.max(1, Math.round(params.density * 4));
    const specs: PrimitiveSpec<'ribbons'>[] = [];
    for (let i = 0; i < count; i += 1) {
      const points: [number, number, number][] = [];
      const n = randInt(rng, 5, 10);
      for (let p = 0; p < n; p += 1) {
        const t = p / (n - 1);
        const yRaw = Math.sin(t * Math.PI * (2 + i)) * 1.5 + (rng() - 0.5);
        const y =
          params.terraceStrength > 0
            ? Math.round(yRaw / Math.max(0.01, params.terraceStrength)) * params.terraceStrength
            : yRaw;
        points.push([(t - 0.5) * 12, y, (rng() - 0.5) * 6]);
      }
      specs.push({
        kind: 'ribbons',
        data: {
          points,
          radius: randRange(rng, 0.08, 0.25),
          segments: 64,
          colorIndex: i % style.palette.accents.length,
          terrace: params.terraceStrength,
        },
      });
    }
    return specs;
  },
  buildThreeObjects: (spec, style) => {
    const data = spec.data;
    const curve = new THREE.CatmullRomCurve3(data.points.map((p) => new THREE.Vector3(...p)));
    const geometry = new THREE.TubeGeometry(curve, data.segments, data.radius, 8, false);
    const mat = new THREE.MeshStandardMaterial({
      color: style.palette.accents[data.colorIndex],
      roughness: style.roughness,
      metalness: style.metalness,
    });
    return new THREE.Mesh(geometry, mat);
  },
};

export default ribbons;
