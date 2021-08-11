import { EventEmitter } from 'events';
import { Vector3 } from 'three';
import { InputManager } from './InputManager';
import { Raycaster } from '../core/Raycaster';
import { Cell } from '../map/Land/Cell';
import { cellSize } from '../utils/constants';
import { TilesEventManager } from '../map/Tile/TilesEventManager';
import { EnemiesEventManager } from '../objects/Enemy/EnemiesEventManager';

const towerCreateButton = document.querySelector('#tower-modal button');

export class EventsManager {
	inputManager: InputManager;
	raycaster: Raycaster;
	emitter: EventEmitter;
	TilesEventManager: TilesEventManager;
	EnemiesEventManager: EnemiesEventManager;
	constructor(raycaster: Raycaster, inputManager: InputManager) {
		this.raycaster = raycaster;
		this.inputManager = inputManager;
		this.emitter = new EventEmitter();

		this.initTilesEventManager();

		this.setWindowEvents();
		this.setRaycasterEvents();

		// console.log(this);
	}

	initTilesEventManager() {
		this.TilesEventManager = new TilesEventManager(this.raycaster);
		this.EnemiesEventManager = new EnemiesEventManager(this.raycaster);
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

		this.emitter.emit('createTower', position, currentTile);
	}
}

{
	// window.addEventListener('mousedown', e => this.inputManager.handleMouseDown(e));
	// window.addEventListener('mouseup', e => this.inputManager.handleMouseUp(e));
	// window.addEventListener('mousewheel', this.inputManager.handleMouseWheel);
}
