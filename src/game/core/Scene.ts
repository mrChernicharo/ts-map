import { Scene as THREEScene, Color, Fog, WebGL1Renderer, Light, DirectionalLight } from 'three';
import { OrbitControls } from './OrbitControls';
import { levelStart, levelFinish, GROUND_WIDTH, GROUND_DEPTH, cellSize } from '../utils/constants';
import { Camera } from './Camera';
import { GUI } from '../helpers/GUI';
import { GameState } from './GameState';
import { EventsManager } from '../managers/EventsManager';
import { Ground } from '../map/Land/Ground';

// class WorldScene
class Scene extends THREEScene {
	state: GameState;
	renderer: WebGL1Renderer;
	lights: Light;
	camera: Camera;
	orbitControls: OrbitControls;
	EventsManager: EventsManager;
	gui: GUI;
	constructor(private domContainer: HTMLDivElement, gameState: GameState) {
		super();
		new THREEScene();
		this.state = gameState;
		this.gui = new GUI();
		this.fog = new Fog(0x003300, -1, 5000);
		this.background = new Color(0x00000);

		this._init();
	}

	_init() {
		this._initCore();

		this.addObjects();

		this.setResizeListener();

		return this;
	}

	_initCore() {
		this.renderer = new WebGL1Renderer({ antialias: true });
		this.renderer.physicallyCorrectLights = true;

		this.camera = new Camera();

		this.orbitControls = new OrbitControls(this.camera, this.domContainer);

		this.lights = new DirectionalLight('white', 1.8);

		this.EventsManager = new EventsManager(this);
	}

	addObjects() {
		// adding test objects

		const ground = new Ground();

		const objects = [ground, this.lights];

		this.add(...objects);
	}

	setResizeListener() {
		window.addEventListener('resize', () => {
			this.setSize(this.domContainer);

			this.onResize();
		});
	}

	setSize(container: Element) {
		this.camera.aspect = container.clientWidth / container.clientHeight;
		// update the camera's frustum. Without this, objects got squished/streched
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(container.clientWidth, container.clientHeight);

		this.renderer.setPixelRatio(window.devicePixelRatio);
	}

	onResize() {
		console.log('resized viewport!');
	}
}
export { Scene };
