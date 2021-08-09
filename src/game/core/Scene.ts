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
import { levelStart, levelFinish, GROUND_WIDTH, GROUND_DEPTH, cellSize } from '../../utils/constants';
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
import { AStarPathfinder } from '../../utils/aStarPathfinder';
import { GameState } from './GameState';

// class WorldScene
class Scene extends THREEScene {
  state: GameState;
  loop: Loop;
  renderer: WebGL1Renderer;
  lights: Light;
  camera: Camera;
  orbitControls: OrbitControls;
  inputManager: InputManager;
  raycaster: Raycaster;
  gui: GUI;
  constructor(private domContainer: HTMLDivElement, gameState: GameState) {
    super();
    new THREEScene();
    this.state = gameState;
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

    this.raycaster = new Raycaster(this.camera, this, this.state);
    this.inputManager = new InputManager(this.camera, this);

    this.orbitControls = new OrbitControls(this.camera, this.domContainer);
    this.orbitControls.enableDamping = true;
    this.orbitControls.maxPolarAngle = Math.PI / 2;

    // this.PointerLockControls = new PointerLockControls(this.camera, this.domContainer);

    this.lights = new DirectionalLight('white', 1.8);
  }

  addObjects() {
    // adding test objects
    // new Polyhedron(this);

    // const rulers = new Rulers();
    const ground = new Ground();
    this.add(ground, this.lights);
  }

  setEvents() {
    window.addEventListener('resize', () => {
      this.setSize(this.domContainer);

      // perform any custom actions
      this.onResize();
    });

    window.addEventListener('keydown', e => this.inputManager.handleKeyDown(e));
    window.addEventListener('keyup', e => this.inputManager.handleKeyUp(e));
    // window.addEventListener('mousedown', e => this.inputManager.handleMouseDown(e));
    // window.addEventListener('mouseup', e => this.inputManager.handleMouseUp(e));
    // window.addEventListener('mousewheel', this.inputManager.handleMouseWheel);

    window.addEventListener('mousemove', e => this.raycaster.handleMouseMove(e));
    window.addEventListener('click', e => this.raycaster.handleClick(e));
  }

  setSize(container: Element) {
    this.camera.aspect = container.clientWidth / container.clientHeight;
    // update the camera's frustum
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(container.clientWidth, container.clientHeight);

    this.renderer.setPixelRatio(window.devicePixelRatio);
  }

  onResize() {}
}
export { Scene };
