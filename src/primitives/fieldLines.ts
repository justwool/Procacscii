import * as THREE from 'three';
import type { PrimitiveModule } from './types';

const fieldLines: PrimitiveModule<'fieldLines'> = {
  generate: (params, rng) => {
    const lines: [number, number, number][][] = [];
    for (let i = 0; i < params.lineCount; i += 1) {
      let x = (rng() - 0.5) * 8;
      let y = (rng() - 0.5) * 8;
      let z = (rng() - 0.5) * 3;
      const line: [number, number, number][] = [];
      for (let s = 0; s < params.stepsPerLine; s += 1) {
        const a = Math.sin(y * 0.7) + Math.cos(z * 0.5);
        const b = Math.sin(x * 0.6) - Math.cos(z * 0.6);
        x += a * params.fieldStrength + (rng() - 0.5) * params.jitter;
        y += b * params.fieldStrength + (rng() - 0.5) * params.jitter;
        z += Math.sin(x * 0.4) * params.fieldStrength * 0.6;
        line.push([x, y, z]);
      }
      lines.push(line);
    }
    return [{ kind: 'fieldLines', data: { lines } }];
  },
  buildThreeObjects: (spec, style) => {
    const group = new THREE.Group();
    spec.data.lines.forEach((line, idx) => {
      const geometry = new THREE.BufferGeometry().setFromPoints(line.map((p) => new THREE.Vector3(...p)));
      const material = new THREE.LineBasicMaterial({
        color: style.palette.accents[idx % style.palette.accents.length],
        transparent: true,
        opacity: 0.7,
      });
      group.add(new THREE.Line(geometry, material));
    });
    return group;
  },
};

export default fieldLines;
