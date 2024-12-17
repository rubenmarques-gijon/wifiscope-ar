import * as THREE from 'three';
import { WifiMeasurement } from '@/types/wifi';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

class ARService {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private labelRenderer: CSS2DRenderer;
  private markers: Map<string, { mesh: THREE.Object3D; label: CSS2DObject }>;
  private cameraControls: { 
    position: THREE.Vector3;
    rotation: THREE.Euler;
  };

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ 
      alpha: true,
      antialias: true 
    });
    this.labelRenderer = new CSS2DRenderer();
    this.markers = new Map();
    this.cameraControls = {
      position: new THREE.Vector3(),
      rotation: new THREE.Euler()
    };

    this.initializeAR();
  }

  private async initializeAR() {
    try {
      // Enhanced AR scene setup
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.outputColorSpace = THREE.SRGBColorSpace;
      
      this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
      this.labelRenderer.domElement.style.position = 'absolute';
      this.labelRenderer.domElement.style.top = '0';
      this.labelRenderer.domElement.style.left = '0';
      this.labelRenderer.domElement.style.pointerEvents = 'none';
      
      // Improved lighting for better visibility
      const ambientLight = new THREE.AmbientLight(0x404040, 2);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
      directionalLight.position.set(1, 1, 1);
      
      this.scene.add(ambientLight);
      this.scene.add(directionalLight);
      
      // Initial camera position
      this.camera.position.z = 5;
      this.camera.lookAt(0, 0, 0);

      // Setup device orientation controls
      if (typeof DeviceOrientationEvent !== 'undefined') {
        window.addEventListener('deviceorientation', this.handleDeviceOrientation.bind(this));
      }
      
      console.log('Enhanced AR initialized successfully');
    } catch (error) {
      console.error('Error initializing AR:', error);
    }
  }

  private handleDeviceOrientation(event: DeviceOrientationEvent) {
    if (event.alpha && event.beta && event.gamma) {
      const alpha = THREE.MathUtils.degToRad(event.alpha);
      const beta = THREE.MathUtils.degToRad(event.beta);
      const gamma = THREE.MathUtils.degToRad(event.gamma);

      this.camera.rotation.set(beta, alpha, -gamma);
    }
  }

  public addMeasurementMarker(position: THREE.Vector3, measurementData: WifiMeasurement): string {
    // Create marker with improved visual quality
    const markerGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const markerMaterial = new THREE.MeshPhongMaterial({ 
      color: this.getColorForSignalStrength(measurementData.signalStrength),
      transparent: true,
      opacity: 0.8,
      shininess: 100
    });
    
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    
    // Convert screen position to world position
    const worldPosition = this.screenToWorld(position);
    marker.position.copy(worldPosition);
    
    marker.castShadow = true;
    marker.receiveShadow = true;

    // Enhanced label with better visibility
    const labelDiv = document.createElement('div');
    labelDiv.className = 'ar-label';
    labelDiv.textContent = `${Math.round(measurementData.signalStrength)} dBm`;
    labelDiv.style.backgroundColor = this.getBackgroundColorForSignalStrength(measurementData.signalStrength);
    labelDiv.style.color = '#ffffff';
    labelDiv.style.padding = '8px 12px';
    labelDiv.style.borderRadius = '8px';
    labelDiv.style.fontSize = '14px';
    labelDiv.style.fontWeight = 'bold';
    labelDiv.style.textAlign = 'center';
    labelDiv.style.whiteSpace = 'nowrap';
    labelDiv.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    
    const label = new CSS2DObject(labelDiv);
    label.position.copy(worldPosition);
    label.position.y += 0.2;
    
    const markerId = `marker-${Date.now()}`;
    this.markers.set(markerId, { mesh: marker, label });
    
    this.scene.add(marker);
    this.scene.add(label);
    
    return markerId;
  }

  private screenToWorld(screenPosition: THREE.Vector3): THREE.Vector3 {
    const vector = new THREE.Vector3();
    vector.set(
      (screenPosition.x / window.innerWidth) * 2 - 1,
      -(screenPosition.y / window.innerHeight) * 2 + 1,
      -1
    );
    vector.unproject(this.camera);
    const dir = vector.sub(this.camera.position).normalize();
    const distance = -this.camera.position.z / dir.z;
    return this.camera.position.clone().add(dir.multiplyScalar(distance));
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

  public render() {
    requestAnimationFrame(() => {
      this.updateMarkersOrientation();
      this.renderer.render(this.scene, this.camera);
      this.labelRenderer.render(this.scene, this.camera);
    });
  }

  private updateMarkersOrientation() {
    this.markers.forEach(({ mesh, label }) => {
      // Make markers always face the camera
      mesh.quaternion.copy(this.camera.quaternion);
      label.quaternion.copy(this.camera.quaternion);
    });
  }

  public getRenderer() {
    return this.renderer;
  }

  public getLabelRenderer() {
    return this.labelRenderer;
  }

  public updateMarkersScale(distance: number) {
    this.markers.forEach(({ mesh, label }) => {
      const scale = Math.max(0.5, Math.min(2, distance / 5));
      mesh.scale.setScalar(scale);
    });
  }

  public cleanup() {
    window.removeEventListener('deviceorientation', this.handleDeviceOrientation.bind(this));
    this.markers.clear();
    this.scene.clear();
  }
}

export default new ARService();