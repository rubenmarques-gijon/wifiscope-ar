import * as THREE from 'three';
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';
import { ARMarker } from './types';
import { WifiMeasurement } from '@/types/wifi';

export class MarkerManager {
  private markers: Map<string, ARMarker>;

  constructor() {
    this.markers = new Map();
  }

  createMarker(position: THREE.Vector3, measurementData: WifiMeasurement): ARMarker {
    const markerGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const markerMaterial = new THREE.MeshPhongMaterial({
      color: this.getColorForSignalStrength(measurementData.signalStrength),
      transparent: true,
      opacity: 0.8,
      shininess: 100
    });

    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.copy(position);
    marker.castShadow = true;
    marker.receiveShadow = true;

    const labelDiv = this.createLabelElement(measurementData.signalStrength);
    const label = new CSS2DObject(labelDiv);
    label.position.copy(position);
    label.position.y += 0.2;

    return { mesh: marker, label };
  }

  private createLabelElement(signalStrength: number): HTMLDivElement {
    const labelDiv = document.createElement('div');
    labelDiv.className = 'ar-label';
    labelDiv.textContent = `${Math.round(signalStrength)} dBm`;
    labelDiv.style.backgroundColor = this.getBackgroundColorForSignalStrength(signalStrength);
    labelDiv.style.color = '#ffffff';
    labelDiv.style.padding = '8px 12px';
    labelDiv.style.borderRadius = '8px';
    labelDiv.style.fontSize = '14px';
    labelDiv.style.fontWeight = 'bold';
    labelDiv.style.textAlign = 'center';
    labelDiv.style.whiteSpace = 'nowrap';
    labelDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    return labelDiv;
  }

  private getColorForSignalStrength(signalStrength: number): number {
    if (signalStrength >= -50) return 0x4ade80; // Green
    if (signalStrength >= -70) return 0xfbbf24; // Yellow
    return 0xef4444; // Red
  }

  private getBackgroundColorForSignalStrength(signalStrength: number): string {
    if (signalStrength >= -50) return 'rgba(74, 222, 128, 0.9)'; // Green
    if (signalStrength >= -70) return 'rgba(251, 191, 36, 0.9)'; // Yellow
    return 'rgba(239, 68, 68, 0.9)'; // Red
  }

  clear(): void {
    this.markers.clear();
  }

  getMarkers(): Map<string, ARMarker> {
    return this.markers;
  }
}