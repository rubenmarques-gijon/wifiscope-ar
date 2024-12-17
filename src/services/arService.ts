import * as THREE from 'three';

class ARService {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private markers: Map<string, THREE.Object3D>;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.markers = new Map();

    this.initializeAR();
  }

  private async initializeAR() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        } 
      });
      
      // Set up AR scene
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      
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
    const markerGeometry = new THREE.SphereGeometry(0.2);
    const markerMaterial = new THREE.MeshPhongMaterial({ 
      color: this.getColorForSignalStrength(measurementData.signalStrength) 
    });
    
    const marker = new THREE.Mesh(markerGeometry, markerMaterial);
    marker.position.copy(position);
    
    const markerId = `marker-${Date.now()}`;
    this.markers.set(markerId, marker);
    this.scene.add(marker);
    
    return markerId;
  }

  private getColorForSignalStrength(signalStrength: number): number {
    if (signalStrength >= -50) return 0x00ff00; // Green
    if (signalStrength >= -70) return 0xffff00; // Yellow
    return 0xff0000; // Red
  }

  public render() {
    this.renderer.render(this.scene, this.camera);
  }

  public getRenderer() {
    return this.renderer;
  }
}

export default new ARService();