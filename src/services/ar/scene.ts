import * as THREE from 'three';
import { CSS2DRenderer } from 'three/addons/renderers/CSS2DRenderer';
import { OrbitControls } from 'three/addons/controls/OrbitControls';
import { ARServiceConfig } from './types';

export class ARScene {
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private renderer: THREE.WebGLRenderer;
  private labelRenderer: CSS2DRenderer;
  private controls: OrbitControls;
  private raycaster: THREE.Raycaster;
  private mouse: THREE.Vector2;

  constructor(config?: ARServiceConfig) {
    const width = config?.width || window.innerWidth;
    const height = config?.height || window.innerHeight;

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true
    });
    this.labelRenderer = new CSS2DRenderer();
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.setupScene(width, height);
    this.setupControls();
    this.setupEventListeners();
  }

  private setupScene(width: number, height: number): void {
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.labelRenderer.setSize(width, height);
    this.labelRenderer.domElement.style.position = 'absolute';
    this.labelRenderer.domElement.style.top = '0';
    this.labelRenderer.domElement.style.left = '0';
    this.labelRenderer.domElement.style.pointerEvents = 'none';

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(1, 1, 1);

    this.scene.add(ambientLight);
    this.scene.add(directionalLight);
    this.camera.position.z = 5;
  }

  private setupControls(): void {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
  }

  private setupEventListeners(): void {
    window.addEventListener('resize', this.handleResize.bind(this));
    window.addEventListener('mousemove', this.handleMouseMove.bind(this));
  }

  private handleResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
    this.labelRenderer.setSize(width, height);
  }

  private handleMouseMove(event: MouseEvent): void {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  screenToWorld(screenPosition: THREE.Vector3): THREE.Vector3 {
    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.scene.children);

    if (intersects.length > 0) {
      return intersects[0].point;
    }

    const vector = new THREE.Vector3(screenPosition.x, screenPosition.y, -1);
    vector.unproject(this.camera);
    const dir = vector.sub(this.camera.position).normalize();
    const distance = 5;
    return this.camera.position.clone().add(dir.multiplyScalar(distance));
  }

  render(): void {
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
    this.labelRenderer.render(this.scene, this.camera);
  }

  add(object: THREE.Object3D): void {
    this.scene.add(object);
  }

  remove(object: THREE.Object3D): void {
    this.scene.remove(object);
  }

  getRenderer(): THREE.WebGLRenderer {
    return this.renderer;
  }

  getLabelRenderer(): CSS2DRenderer {
    return this.labelRenderer;
  }

  cleanup(): void {
    window.removeEventListener('resize', this.handleResize.bind(this));
    window.removeEventListener('mousemove', this.handleMouseMove.bind(this));
    this.scene.clear();
    this.controls.dispose();
  }
}