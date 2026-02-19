import * as THREE from 'three';
import type { PrimitiveModule, PrimitiveSpec } from './types';
import { randRange } from '../core/rng';
import { colorFor, createMaterial } from './materials';

const ribbons: PrimitiveModule<'ribbons'> = {
  generate: (params, rng, style, field) => {
    const count = Math.max(1, Math.round(params.density * 5));
    const specs: PrimitiveSpec<'ribbons'>[] = [];
    for (let i = 0; i < count; i += 1) {
      let [x, y, z] = field.spawnPoint(rng);
      const points: [number, number, number][] = [];
      for (let p = 0; p < 24; p += 1) {
        const [vx, vy, vz] = field.sampleVector(x, y, z);
        const bend = 0.25 + params.bendAmount;
        x += (vx * bend + (rng() - 0.5) * params.jitter) * params.fieldStrength * 1.1;
        y += (vy * bend + (rng() - 0.5) * params.jitter) * params.fieldStrength * 1.1;
        z += (vz * bend + (rng() - 0.5) * params.jitter) * params.fieldStrength * 1.1;
        points.push([x, y, z]);
      }
      specs.push({
        kind: 'ribbons',
        data: {
          points,
          radius: randRange(rng, 0.05, 0.2) * (1 - params.taper * 0.5),
          segments: 48,
          colorIndex: i % style.palette.accents.length,
        },
      });
    }
    return specs;
  },
  buildThreeObjects: (spec, style) => {
    const curve = new THREE.CatmullRomCurve3(spec.data.points.map((p) => new THREE.Vector3(...p)));
    const geometry = new THREE.TubeGeometry(curve, spec.data.segments, spec.data.radius, 8, false);
    const mat = createMaterial(style, colorFor(style, spec.data.colorIndex, spec.data.colorIndex / 8));
    return new THREE.Mesh(geometry, mat);
  },
};

export default ribbons;
