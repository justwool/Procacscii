import * as THREE from 'three';
import type { Params } from './params';
import type { RNG } from './rng';
import type { StyleSpec } from './style';
import type { PrimitiveKind, PrimitiveSpec } from '../primitives/types';
import ribbons from '../primitives/ribbons';
import steps from '../primitives/steps';
import fieldLines from '../primitives/fieldLines';
import blobs from '../primitives/blobs';
import { createFieldContext } from './field';

const registry = { ribbons, steps, fieldLines, blobs };

export interface SceneSpec {
  primitives: PrimitiveSpec[];
}

function paramsForPrimitive(kind: PrimitiveKind, params: Params, mix: number): Params {
  if (kind === 'ribbons') return { ...params, density: params.density * mix };
  if (kind === 'steps') return { ...params, stepCount: Math.max(2, Math.round(params.stepCount * mix)) };
  if (kind === 'fieldLines') return { ...params, lineCount: Math.max(2, Math.round(params.lineCount * mix)) };
  if (kind === 'blobs') return { ...params, density: params.density * Math.max(0.5, mix) };
  return params;
}

export function generateScene(params: Params, rng: RNG, style: StyleSpec): SceneSpec {
  const primitives: PrimitiveSpec[] = [];
  const field = createFieldContext(params);

  (Object.keys(params.primitiveMix) as PrimitiveKind[]).forEach((kind) => {
    const mix = params.primitiveMix[kind];
    if (mix <= 0) return;
    const scaledParams = paramsForPrimitive(kind, params, mix);
    primitives.push(...registry[kind].generate(scaledParams, rng, style, field));
  });

  return { primitives };
}

export function buildSceneObjects(sceneSpec: SceneSpec, style: StyleSpec): THREE.Object3D[] {
  return sceneSpec.primitives.flatMap((spec) => {
    const obj = registry[spec.kind].buildThreeObjects(spec as never, style as never);
    return Array.isArray(obj) ? obj : [obj];
  });
}
