import * as THREE from 'three';
import type { StyleSpec } from '../core/style';

export function colorFor(style: StyleSpec, index: number, t = 0): THREE.Color {
  if (style.colorApplicationMode === 'solid') {
    return new THREE.Color(style.palette.accents[0] ?? '#ffffff');
  }
  if (style.colorApplicationMode === 'strata') {
    return new THREE.Color(style.palette.accents[index % style.palette.accents.length] ?? '#ffffff');
  }

  const stops = style.palette.gradientStops;
  if (stops.length < 2) return new THREE.Color(style.palette.accents[index % style.palette.accents.length] ?? '#ffffff');
  const clamped = Math.max(0, Math.min(1, t));
  const scaled = clamped * (stops.length - 1);
  const lo = Math.floor(scaled);
  const hi = Math.min(stops.length - 1, lo + 1);
  const amt = scaled - lo;
  const c1 = new THREE.Color(stops[lo]?.color ?? '#ffffff');
  const c2 = new THREE.Color(stops[hi]?.color ?? '#ffffff');
  return c1.lerp(c2, amt);
}

export function createMaterial(style: StyleSpec, color: THREE.Color): THREE.Material {
  const base = { color };
  if (style.materialModel === 'flat') {
    return new THREE.MeshBasicMaterial(base);
  }
  if (style.materialModel === 'pbr') {
    return new THREE.MeshStandardMaterial({ ...base, roughness: style.roughness, metalness: style.metalness });
  }
  return new THREE.MeshLambertMaterial(base);
}
