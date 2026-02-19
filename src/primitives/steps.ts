import * as THREE from 'three';
import type { PrimitiveModule } from './types';
import { colorFor, createMaterial } from './materials';

const steps: PrimitiveModule<'steps'> = {
  generate: (params, _rng, _style, field) => {
    const boxes: { pos: [number, number, number]; scale: [number, number, number]; level: number }[] = [];
    const grid = Math.max(4, Math.round(params.stepCount / 2));
    for (let gx = 0; gx < grid; gx += 1) {
      for (let gz = 0; gz < grid; gz += 1) {
        const x = ((gx / Math.max(1, grid - 1)) - 0.5) * field.domainRadius * 1.8;
        const z = ((gz / Math.max(1, grid - 1)) - 0.5) * field.domainRadius * 1.8;
        if (params.compositionMode === 'framed' && (Math.abs(x) > field.domainRadius * 0.72 || Math.abs(z) > field.domainRadius * 0.72)) {
          continue;
        }
        const n = field.sampleScalar(x, 0, z);
        const quantized = Math.round(n * params.stepCount * (0.4 + params.terraceStrength));
        const level = Math.max(1, Math.abs(quantized));
        boxes.push({
          pos: [x, level * params.stepHeight * 0.4 - field.domainRadius * 0.15, z],
          scale: [params.stepDepth * (1 - params.taper * 0.2), params.stepHeight * level, params.stepDepth * (1 - params.taper * 0.2)],
          level,
        });
      }
    }

    return [{ kind: 'steps', data: { boxes } }];
  },
  buildThreeObjects: (spec, style) => {
    const g = new THREE.Group();
    for (const box of spec.data.boxes) {
      const geom = new THREE.BoxGeometry(box.scale[0], box.scale[1], box.scale[2]);
      const color = colorFor(style, box.level, box.level / 10);
      const mesh = new THREE.Mesh(geom, createMaterial(style, color));
      mesh.position.set(...box.pos);
      g.add(mesh);
    }
    return g;
  },
};

export default steps;
