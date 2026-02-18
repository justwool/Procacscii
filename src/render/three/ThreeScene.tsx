import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { Params } from '../../core/params';
import { mulberry32 } from '../../core/rng';
import { deriveStyle } from '../../core/style';
import { buildSceneObjects, generateScene } from '../../core/generateScene';

interface Props {
  params: Params;
  onBaseCanvas: (canvas: HTMLCanvasElement) => void;
}

export function ThreeScene({ params, onBaseCanvas }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;
    const width = 900;
    const height = 600;
    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    renderer.setSize(width, height);
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const rng = mulberry32(params.seed);
    const style = deriveStyle(params, rng);
    scene.background = new THREE.Color(style.palette.background);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, params.cameraPreset === 'near' ? 7 : params.cameraPreset === 'far' ? 16 : 11, params.cameraPreset === 'near' ? 10 : 14);
    camera.lookAt(0, 0, 0);

    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dir = new THREE.DirectionalLight(0xffffff, 1.1 + style.rimLightStrength);
    dir.position.set(3, 5, 4);
    scene.add(dir);

    const sceneSpec = generateScene(params, rng, style);
    buildSceneObjects(sceneSpec, style).forEach((obj) => scene.add(obj));

    if (style.fogStrength > 0) {
      scene.fog = new THREE.Fog(style.palette.background, 9, 25 - style.fogStrength * 10);
    }

    renderer.render(scene, camera);
    onBaseCanvas(renderer.domElement);

    return () => {
      renderer.dispose();
    };
  }, [params, onBaseCanvas]);

  return <div ref={mountRef} />;
}
