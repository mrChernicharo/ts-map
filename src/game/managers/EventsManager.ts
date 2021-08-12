import { EventEmitter } from 'events';
import { Vector3 } from 'three';
import { InputManager } from './InputManager';
import { Raycaster } from '../core/dependecies/Raycaster';
import { Cell } from '../map/Land/Cell';
import { ADD_TO_LOOP, cellSize, CREATE_TOWER, TOWER_CREATED, TOWER_SOLD } from '../utils/constants';
import { random, towerGenerator } from '../utils/functions';
import { TilesEventManager } from '../map/Tile/TilesEventManager';
import { EnemiesEventManager } from '../objects/Enemy/EnemiesEventManager';
import { Scene } from '../core/Scene';
import { Tower } from '../objects/Tower/Tower';

const towerCreateButton = document.querySelector('#tower-modal button');

export class EventsManager {
	scene: Scene;
	inputManager: InputManager;
	raycaster: Raycaster;
	TilesEventManager: TilesEventManager;
	EnemiesEventManager: EnemiesEventManager;
	emitter: EventEmitter;
	constructor(scene: Scene) {
		this.scene = scene;

		this.emitter = new EventEmitter();

		this._init();
	}

	_init() {
		this.raycaster = new Raycaster(this.scene.camera, this.scene);
		this.inputManager = new InputManager(this.scene.camera, this.scene);
		this.TilesEventManager = new TilesEventManager(this.raycaster);
		this.EnemiesEventManager = new EnemiesEventManager(this.raycaster);

		this.setWindowEvents();
		this.setRaycasterEvents();
		this.setObjectsEvents();
	}

	setWindowEvents() {
		window.addEventListener('keydown', e => this.inputManager.handleKeyDown(e));
		window.addEventListener('keyup', e => this.inputManager.handleKeyUp(e));
	}

	setRaycasterEvents() {
		window.addEventListener('mousemove', e => this.raycaster.handleMouseMove(e));

		window.addEventListener('mousedown', e => {
			this.TilesEventManager.closeModal();
			this.raycaster.handleClick(e);
		});
	}

	setObjectsEvents() {
		this.TilesEventManager.emitter.on(TOWER_CREATED, (tower: Tower) =>
			this.emitter.emit(TOWER_CREATED, tower)
		);

		this.TilesEventManager.emitter.on(TOWER_SOLD, (tower: Tower) => this.emitter.emit(TOWER_SOLD, tower));
	}
}

{
	// window.addEventListener('mousedown', e => this.inputManager.handleMouseDown(e));
	// window.addEventListener('mouseup', e => this.inputManager.handleMouseUp(e));
	// window.addEventListener('mousewheel', this.inputManager.handleMouseWheel);
}
