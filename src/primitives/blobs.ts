import * as THREE from 'three';
import type { PrimitiveModule } from './types';

const blobs: PrimitiveModule<'blobs'> = {
  generate: () => [],
  buildThreeObjects: () => new THREE.Group(),
};

export default blobs;
