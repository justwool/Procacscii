import * as THREE from 'three';
import type { Params } from './params';
import type { RNG } from './rng';
import type { StyleSpec } from './style';
import type { PrimitiveKind, PrimitiveSpec } from '../primitives/types';
import ribbons from '../primitives/ribbons';
import steps from '../primitives/steps';
import fieldLines from '../primitives/fieldLines';
import blobs from '../primitives/blobs';

const registry = {
  ribbons,
  steps,
  fieldLines,
  blobs,
};

export interface SceneSpec {
  primitives: PrimitiveSpec[];
}

export function generateScene(params: Params, rng: RNG, style: StyleSpec): SceneSpec {
  const primitives: PrimitiveSpec[] = [];
  (Object.keys(params.primitiveMix) as PrimitiveKind[]).forEach((kind) => {
    if (params.primitiveMix[kind] <= 0) return;

    if (kind === 'ribbons') primitives.push(...registry.ribbons.generate(params, rng, style));
    if (kind === 'steps') primitives.push(...registry.steps.generate(params, rng, style));
    if (kind === 'fieldLines') primitives.push(...registry.fieldLines.generate(params, rng, style));
    if (kind === 'blobs') primitives.push(...registry.blobs.generate(params, rng, style));
  });

  return { primitives };
}

export function buildSceneObjects(sceneSpec: SceneSpec, style: StyleSpec): THREE.Object3D[] {
  return sceneSpec.primitives.flatMap((spec) => {
    const obj = (() => {
      switch (spec.kind) {
        case 'ribbons':
          return registry.ribbons.buildThreeObjects(spec, style);
        case 'steps':
          return registry.steps.buildThreeObjects(spec, style);
        case 'fieldLines':
          return registry.fieldLines.buildThreeObjects(spec, style);
        case 'blobs':
          return registry.blobs.buildThreeObjects(spec, style);
        default:
          return new THREE.Group();
      }
    })();

    return Array.isArray(obj) ? obj : [obj];
  });
}
