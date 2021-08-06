import {
  Scene as THREEScene,
  Color,
  Fog,
  WebGL1Renderer,
  Light,
  DirectionalLight,
  FontLoader,
  TextGeometry,
  MeshBasicMaterial,
  Mesh,
  PolyhedronGeometry,
  MeshLambertMaterial,
  MeshToonMaterial,
  MeshPhongMaterial,
  Vector2,
  Vector3,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { levelStart, levelFinish, GROUND_WIDTH, GROUND_DEPTH, tileSize } from '../../utils/constants';
import { Cube } from '../objects/Cube';
import { Ball } from '../objects/Ball';
import { Flag } from '../objects/Flag';
import { Ground } from '../map/Ground';
import { Rulers } from '../objects/Rulers';
import { Camera } from './Camera';
import { GUI } from './GUI';
import { Loop } from './Loop';
import { Polyhedron } from '../objects/Meshes';
import { createAxesHelper, createGridHelper } from '../../utils/helpers';
import { InputManager } from './InputManager';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls';
import { Raycaster } from './Raycaster';
// import pathfinding from 'three-pathfinding';

// class WorldScene
class Scene extends THREEScene {
  renderer: WebGL1Renderer;
  camera: Camera;
  orbitControls: OrbitControls;
  PointerLockControls: PointerLockControls;
  loop: Loop;
  lights: Light;
  gui: GUI;
  inputManager: InputManager;
  raycaster: Raycaster;
  constructor(private domContainer: HTMLDivElement) {
    super();
    new THREEScene();
    this.gui = new GUI();
    this.fog = new Fog(0x003300, -1, 5000);
    this.background = new Color(0x00000);
    this.init();
  }

  init() {
    this.initCore();

    // this.add(ground);

    this.addObjects();

    this.setEvents();

    return this;
  }

  initCore() {
    this.loop = new Loop(this.camera, this, this.renderer);

    this.renderer = new WebGL1Renderer({ antialias: true });
    this.renderer.physicallyCorrectLights = true;

    this.camera = new Camera();

    this.inputManager = new InputManager();

    this.raycaster = new Raycaster(this.camera, this);

    this.orbitControls = new OrbitControls(this.camera, this.domContainer);
    this.orbitControls.enableDamping = true;
    this.orbitControls.maxPolarAngle = Math.PI / 2;

    // this.PointerLockControls = new PointerLockControls(this.camera, this.domContainer);

    this.lights = new DirectionalLight('white', 1.8);
  }

  addObjects() {
    // adding test objects
    // new Polyhedron(this);

    const rulers = new Rulers();
    const ground = new Ground();
    this.add(ground, rulers, this.lights);
  }

  setEvents() {
    window.addEventListener('resize', () => {
      this.setSize(this.domContainer);

      // perform any custom actions
      this.onResize();
    });

    window.addEventListener('keydown', this.inputManager.handleKeyDown);
    window.addEventListener('keyup', this.inputManager.handleKeyUp);
    window.addEventListener('mousedown', this.inputManager.handleMouseDown);
    window.addEventListener('mouseup', this.inputManager.handleMouseUp);
    window.addEventListener('mousewheel', this.inputManager.handleMouseWheel);

    window.addEventListener('mousemove', e => this.raycaster.handleMouseMove(e));
  }

  setSize(container: Element) {
    this.camera.aspect = container.clientWidth / container.clientHeight;
    // update the camera's frustum
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(container.clientWidth, container.clientHeight);

    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  onResize() {
    // console.log('resizing');
  }
}
export { Scene };
