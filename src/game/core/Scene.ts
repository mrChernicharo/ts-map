import { Scene as THREEScene, Color, Fog, WebGL1Renderer, Light, DirectionalLight } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { levelStart, levelEnd } from '../../utils/Level';
import { Cube } from '../objects/Cube';
import { Enemy } from '../objects/Enemy';
import { Flag } from '../objects/Flag';
import { Ground } from '../objects/Ground';
import { Camera } from './Camera';
import { Loop } from './Loop';

class Scene extends THREEScene {
  renderer: WebGL1Renderer;
  camera: Camera;
  controls: OrbitControls;
  loop: Loop;
  lights: Light;

  constructor(private domContainer: HTMLDivElement) {
    super();
    new THREEScene();
    this.init();
  }

  init() {
    this.fog = new Fog(0x565656, -1, 1000);
    this.background = new Color('black');

    this.loop = new Loop(this.camera, this, this.renderer);

    this.renderer = new WebGL1Renderer({ antialias: true });
    this.renderer.physicallyCorrectLights = true;

    this.camera = new Camera();

    this.controls = new OrbitControls(this.camera, this.domContainer);
    this.controls.enableDamping = true;
    this.controls.maxPolarAngle = Math.PI / 2;

    this.lights = new DirectionalLight('white', 1.8);
    this.add(this.lights);

    const ground = new Ground(400, 400);
    ground.makeGrid();

    const [start, end] = [
      new Flag(levelStart.x, levelStart.y, levelStart.z),
      new Flag(levelEnd.x, levelEnd.y, levelEnd.z),
    ];

    this.add(ground, start, end);

    window.addEventListener('resize', () => {
      this.setSize(this.domContainer);
      // perform any custom actions
      this.onResize();
    });

    return this;
  }

  setSize(container: Element) {
    this.camera.aspect = container.clientWidth / container.clientHeight;
    // update the camera's frustum
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(container.clientWidth, container.clientHeight);

    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  onResize() {
    console.log('resizing');
  }
}
export { Scene };
