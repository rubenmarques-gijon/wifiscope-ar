import * as THREE from 'three';
import { WifiMeasurement } from '@/types/wifi';
import { ARScene } from './ar/scene';
import { MarkerManager } from './ar/markers';
import { ARMarker } from './ar/types';

class ARService {
  private scene: ARScene;
  private markerManager: MarkerManager;
  private markers: Map<string, ARMarker>;

  constructor() {
    this.scene = new ARScene();
    this.markerManager = new MarkerManager();
    this.markers = this.markerManager.getMarkers();
    console.log('AR Service initialized');
  }

  public addMeasurementMarker(position: THREE.Vector3, measurementData: WifiMeasurement): string {
    const worldPosition = this.scene.screenToWorld(position);
    const { mesh, label } = this.markerManager.createMarker(worldPosition, measurementData);

    const markerId = `marker-${Date.now()}`;
    this.markers.set(markerId, { mesh, label });

    this.scene.add(mesh);
    this.scene.add(label);

    return markerId;
  }

  public updateMarkersScale(distance: number): void {
    this.markers.forEach(({ mesh }) => {
      const scale = Math.max(0.5, Math.min(2, distance / 5));
      mesh.scale.setScalar(scale);
    });
  }

  public render(): void {
    requestAnimationFrame(() => {
      this.updateMarkersOrientation();
      this.scene.render();
    });
  }

  private updateMarkersOrientation(): void {
    const cameraQuaternion = this.scene.getRenderer().xr?.getCamera().quaternion;
    if (!cameraQuaternion) return;

    this.markers.forEach(({ mesh, label }) => {
      mesh.quaternion.copy(cameraQuaternion);
      label.quaternion.copy(cameraQuaternion);
      label.position.copy(mesh.position);
      label.position.y += 0.2;
    });
  }

  public getRenderer(): THREE.WebGLRenderer {
    return this.scene.getRenderer();
  }

  public getLabelRenderer(): THREE.CSS2DRenderer {
    return this.scene.getLabelRenderer();
  }

  public cleanup(): void {
    this.markerManager.clear();
    this.scene.cleanup();
  }
}

export default new ARService();