import * as THREE from 'three';
import type { PrimitiveModule } from './types';
import { colorFor, createMaterial } from './materials';

const fieldLines: PrimitiveModule<'fieldLines'> = {
  generate: (params, rng, _style, field) => {
    const lines: [number, number, number][][] = [];
    for (let i = 0; i < params.lineCount; i += 1) {
      let [x, y, z] = field.spawnPoint(rng);
      const line: [number, number, number][] = [];
      for (let s = 0; s < params.stepsPerLine; s += 1) {
        const [vx, vy, vz] = field.sampleVector(x, y, z);
        const jx = (rng() - 0.5) * params.jitter;
        const jy = (rng() - 0.5) * params.jitter;
        const jz = (rng() - 0.5) * params.jitter;
        x += (vx + jx) * params.fieldStrength;
        y += (vy + jy) * params.fieldStrength;
        z += (vz + jz) * params.fieldStrength;
        line.push([x, y, z]);
      }
      lines.push(line);
    }
    return [{ kind: 'fieldLines', data: { lines, radius: Math.max(0.005, params.lineWidth * 0.0125) } }];
  },
  buildThreeObjects: (spec, style) => {
    const group = new THREE.Group();
    spec.data.lines.forEach((line, idx) => {
      const curve = new THREE.CatmullRomCurve3(line.map((p) => new THREE.Vector3(...p)));
      const geometry = new THREE.TubeGeometry(curve, Math.max(8, line.length - 1), spec.data.radius, 5, false);
      const color = colorFor(style, idx, idx / Math.max(1, spec.data.lines.length - 1));
      group.add(new THREE.Mesh(geometry, createMaterial(style, color)));
    });
    return group;
  },
};

export default fieldLines;
