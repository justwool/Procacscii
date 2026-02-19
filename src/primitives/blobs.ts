import * as THREE from 'three';
import type { PrimitiveModule } from './types';
import { colorFor, createMaterial } from './materials';

const blobs: PrimitiveModule<'blobs'> = {
  generate: (params, rng, _style, field) => {
    const count = Math.max(1, Math.round(params.density * 6));
    const blobs: { pos: [number, number, number]; radius: number }[] = [];
    for (let i = 0; i < count; i += 1) {
      const [x, y, z] = field.spawnPoint(rng);
      blobs.push({
        pos: [x, y, z],
        radius: 0.2 + field.sampleScalar(x, y, z) * 0.8,
      });
    }
    return [{ kind: 'blobs', data: { blobs } }];
  },
  buildThreeObjects: (spec, style) => {
    const group = new THREE.Group();
    spec.data.blobs.forEach((blob, idx) => {
      const geometry = new THREE.SphereGeometry(Math.max(0.1, blob.radius), 14, 12);
      const mesh = new THREE.Mesh(geometry, createMaterial(style, colorFor(style, idx, idx / Math.max(1, spec.data.blobs.length - 1))));
      mesh.position.set(...blob.pos);
      group.add(mesh);
    });
    return group;
  },
};

export default blobs;
