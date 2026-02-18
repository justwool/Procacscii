import * as THREE from 'three';
import type { PrimitiveModule } from './types';

const steps: PrimitiveModule<'steps'> = {
  generate: (params) => [
    {
      kind: 'steps',
      data: {
        levels: params.stepCount,
        height: params.stepHeight,
        depth: params.stepDepth,
        taper: params.taper,
        spacing: params.spacing,
      },
    },
  ],
  buildThreeObjects: (spec, style) => {
    const g = new THREE.Group();
    const { levels, height, depth, taper, spacing } = spec.data;
    for (let i = 0; i < levels; i += 1) {
      const scale = 1 - (i / Math.max(1, levels - 1)) * taper;
      const geom = new THREE.BoxGeometry(5 * scale, height, depth * scale);
      const color = style.palette.accents[i % style.palette.accents.length];
      const mat = new THREE.MeshLambertMaterial({ color });
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.y = i * (height + spacing) - (levels * (height + spacing)) / 3;
      mesh.position.z = i * 0.12;
      mesh.rotation.y = i * 0.02;
      g.add(mesh);
    }
    return g;
  },
};

export default steps;
