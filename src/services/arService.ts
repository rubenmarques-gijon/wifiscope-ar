import * as THREE from 'three';
import { WifiMeasurement } from './wifiService';
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer';

class ARService {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private labelRenderer: CSS2DRenderer;
  private markers: Map<string, { mesh: THREE.Object3D; label: CSS2DObject }>;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.labelRenderer = new CSS2DRenderer();
    this.markers = new Map();

    this.initializeAR();
  }

  private async initializeAR() {
    try {
      // Set up AR scene
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      
      // Set up label renderer
      this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
      this.labelRenderer.domElement.style.position = 'absolute';
      this.labelRenderer.domElement.style.top = '0';
      this.labelRenderer.domElement.style.pointerEvents = 'none';
      
      // Add lights
      const ambientLight = new THREE.AmbientLight(0x404040);
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1, 1, 1);
      
      this.scene.add(ambientLight);
      this.scene.add(directionalLight);
      
      // Position camera
      this.camera.position.z = 5;
      
      console.log('AR initialized successfully');
    } catch (error) {
      console.error('Error initializing AR:', error);
    }
  }

  public addMeasurementMarker(position: THREE.Vector3, measurementData: WifiMeasurement) {
    // Create marker mesh
    const markerGeometry = new THREE.SphereGeometry(0.15);
    const markerMaterial = new THREE.MeshPhongMaterial({ 
      color: this.getColorForSignalStrength(measurementData.signalStrength),
      transparent: true,
      opacity: 0.8
    });
    
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.copy(position);

    // Create label
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
    
    const label = new CSS2DObject(labelDiv);
    label.position.copy(position);
    label.position.y += 0.2; // Position label slightly above marker
    
    const markerId = `marker-${Date.now()}`;
    this.markers.set(markerId, { mesh: marker, label });
    
    this.scene.add(marker);
    this.scene.add(label);
    
    return markerId;
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
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
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
}

export default new ARService();