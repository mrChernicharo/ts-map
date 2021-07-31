import { Scene as THREEScene, Color, Fog, WebGL1Renderer, Light, DirectionalLight } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { levelStart, levelEnd, GROUND_WIDTH, GROUND_DEPTH } from '../../utils/constants';
import { Cube } from '../objects/Cube';
import { Enemy } from '../objects/Enemy';
import { Flag } from '../objects/Flag';
import { Ground } from '../objects/Ground';
import { Rulers } from '../objects/Rulers';
import { Camera } from './Camera';
import { GUI } from './GUI';
import { Loop } from './Loop';

class Scene extends THREEScene {
  renderer: WebGL1Renderer;
  camera: Camera;
  controls: OrbitControls;
  loop: Loop;
  lights: Light;
  gui: GUI;
  constructor(private domContainer: HTMLDivElement) {
    super();
    new THREEScene();
    this.gui = new GUI();
    this.fog = new Fog(0x003300, -1, 1200);
    this.background = new Color('black');
    this.init();
  }

  init() {
    this.loop = new Loop(this.camera, this, this.renderer);

    this.renderer = new WebGL1Renderer({ antialias: true });
    this.renderer.physicallyCorrectLights = true;

    this.camera = new Camera();

    this.controls = new OrbitControls(this.camera, this.domContainer);
    this.controls.enableDamping = true;
    this.controls.maxPolarAngle = Math.PI / 2;

    this.lights = new DirectionalLight('white', 1.8);
    this.add(this.lights);

    const rulers = new Rulers();
    const ground = new Ground();
    ground.makeGrid();

    this.add(ground, rulers);

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