import { EventEmitter } from 'events';
import { Vector3 } from 'three';
import { InputManager } from './InputManager';
import { Raycaster } from '../core/Raycaster';
import { Cell } from '../map/Land/Cell';
import { cellSize, CREATE_TOWER, random, towerGenerator } from '../utils/constants';
import { TilesEventManager } from '../map/Tile/TilesEventManager';
import { EnemiesEventManager } from '../objects/Enemy/EnemiesEventManager';
import { Scene } from '../core/Scene';
import { Tower } from '../objects/Tower/Tower';

const towerCreateButton = document.querySelector('#tower-modal button');

export class EventsManager {
	scene: Scene;
	inputManager: InputManager;
	raycaster: Raycaster;
	emitter: EventEmitter;
	TilesEventManager: TilesEventManager;
	EnemiesEventManager: EnemiesEventManager;
	constructor(scene: Scene) {
		this.scene = scene;

		this.emitter = new EventEmitter();

		this._initEventManager();

		// console.log(this);
	}

	_initEventManager() {
		this.raycaster = new Raycaster(this.scene.camera, this.scene);
		this.inputManager = new InputManager(this.scene.camera, this.scene);
		this.TilesEventManager = new TilesEventManager(this.raycaster);
		this.EnemiesEventManager = new EnemiesEventManager(this.raycaster);

		this.setWindowEvents();
		this.setRaycasterEvents();
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

		towerCreateButton.addEventListener('click', () => this.createTower());
	}

	createTower() {
		const currentTile = this.TilesEventManager.previousTileClicked;
		const currentCell = this.TilesEventManager.previousTileClicked.parent as Cell;

		const { position } = currentCell;
		const types = ['A', 'B'];
		const towerType = types[random(0, 1)];

		this.emitter.emit(CREATE_TOWER, position, currentTile, towerType);
	}
}

{
	// window.addEventListener('mousedown', e => this.inputManager.handleMouseDown(e));
	// window.addEventListener('mouseup', e => this.inputManager.handleMouseUp(e));
	// window.addEventListener('mousewheel', this.inputManager.handleMouseWheel);
}
