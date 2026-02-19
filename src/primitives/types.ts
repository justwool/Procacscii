import type * as THREE from 'three';
import type { Params } from '../core/params';
import type { RNG } from '../core/rng';
import type { StyleSpec } from '../core/style';
import type { FieldContext } from '../core/field';

export type PrimitiveKind = 'ribbons' | 'steps' | 'fieldLines' | 'blobs';

export interface RibbonData {
  points: [number, number, number][];
  radius: number;
  segments: number;
  colorIndex: number;
}

export interface StepsData {
  boxes: { pos: [number, number, number]; scale: [number, number, number]; level: number }[];
}

export interface FieldLineData {
  lines: [number, number, number][][];
  radius: number;
}

export interface BlobData {
  blobs: { pos: [number, number, number]; radius: number }[];
}

export interface PrimitiveDataMap {
  ribbons: RibbonData;
  steps: StepsData;
  fieldLines: FieldLineData;
  blobs: BlobData;
}

export type PrimitiveSpec<K extends PrimitiveKind = PrimitiveKind> = {
  [P in PrimitiveKind]: {
    kind: P;
    data: PrimitiveDataMap[P];
  }
}[K];

export interface PrimitiveModule<K extends PrimitiveKind = PrimitiveKind> {
  generate: (params: Params, rng: RNG, style: StyleSpec, field: FieldContext) => PrimitiveSpec<K>[];
  buildThreeObjects: (spec: PrimitiveSpec<K>, style: StyleSpec) => THREE.Object3D | THREE.Object3D[];
}
