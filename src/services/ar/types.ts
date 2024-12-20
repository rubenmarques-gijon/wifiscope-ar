import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

export interface ARMarker {
  mesh: THREE.Object3D;
  label: CSS2DObject;
}

export interface ARServiceConfig {
  width?: number;
  height?: number;
}