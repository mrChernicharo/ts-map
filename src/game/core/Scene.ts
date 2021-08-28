import { Scene as THREEScene, Color, Fog, WebGLRenderer, Light, DirectionalLight } from 'three';
import { OrbitControls } from './dependecies/OrbitControls';
import {
	levelStart,
	levelFinish,
	GROUND_WIDTH,
	GROUND_DEPTH,
	cellSize,
	GAME_READY,
} from '../utils/constants';
import { Camera } from './dependecies/Camera';
import { GUI } from '../helpers/GUI';
import { GameState } from './dependecies/GameState';
import { EventsManager } from '../managers/EventsManager';
import { Ground } from '../map/Land/Ground';
import { LoadingScreen } from '../templates/Loading';
import { PlayerStats } from '../templates/PlayerStats';

// class WorldScene
class Scene extends THREEScene {
	state: GameState;
	renderer: WebGLRenderer;
	lights: Light;
	camera: Camera;
	orbitControls: OrbitControls;
	eventsManager: EventsManager;
	gui: GUI;
	loading: LoadingScreen;
	ready = false;
	constructor(private domContainer: HTMLDivElement, gameState: GameState) {
		super();
		new THREEScene();
		this.state = gameState;
		// this.gui = new GUI();
		this.fog = new Fog(0x003300, -1, 5000);
		this.background = new Color(0x00000);
		this.loading = new LoadingScreen();
		this._init();
	}

	async _init() {
		this._initCore();
		this.setResizeListener();

		const ground = await this.addObjects();

		const groundInterval = setInterval(() => {
			if (ground.hasCompletePath) {
				clearInterval(groundInterval);

				this.eventsManager.emitter.emit(GAME_READY);
				console.log("game's ready");

				this.ready = true;
				this.loading.done();
			}
		}, 400);
	}

	_initCore() {
		this.renderer = new WebGLRenderer({ antialias: true });
		this.renderer.physicallyCorrectLights = true;

		this.camera = new Camera();

		this.orbitControls = new OrbitControls(this.camera, this.domContainer);

		this.lights = new DirectionalLight('white', 1.8);

		this.eventsManager = new EventsManager(this);
	}

	async addObjects() {
		const ground = await this.groundInit();

		const objects = [ground, this.lights];

		this.add(...objects);

		return ground;
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

	async groundInit(): Promise<Ground> {
		let promFn = new Promise((resolve, reject) => {
			const ground = new Ground();
			setTimeout(() => {
				resolve(ground);
			}, 600);
		});

		let promise = promFn;

		return promise as Promise<Ground>;
	}
}
export { Scene };
