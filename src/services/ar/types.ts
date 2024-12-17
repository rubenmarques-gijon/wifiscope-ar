import * as THREE from 'three';
import { CSS2DObject } from 'three/addons/renderers/CSS2DRenderer';

export interface ARMarker {
  mesh: THREE.Object3D;
  label: CSS2DObject;
}

export interface ARServiceConfig {
  width?: number;
  height?: number;
}