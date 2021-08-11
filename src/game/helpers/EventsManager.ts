import { EventEmitter } from 'events';
import { Vector3 } from 'three';
import { InputManager } from '../core/InputManager';
import { Raycaster } from '../core/Raycaster';
import { Cell } from '../map/Cell';
import { Spot } from '../map/Ground';
import { cellSize } from '../utils/constants';
import { TilesStateManager } from './TilesStateManager';

const towerCreateButton = document.querySelector('#tower-modal button');

export class EventsManager {
	inputManager: InputManager;
	raycaster: Raycaster;
	emitter: EventEmitter;
	tilesStateManager: TilesStateManager;
	constructor(raycaster: Raycaster, inputManager: InputManager) {
		this.raycaster = raycaster;
		this.inputManager = inputManager;
		this.emitter = new EventEmitter();

		this.initTilesStateManager();

		this.setWindowEvents();
		this.setRaycasterEvents();

		this.setTowerEvents();
		// console.log(this);
	}

	initTilesStateManager() {
		this.tilesStateManager = new TilesStateManager(this.raycaster);
	}

	setWindowEvents() {
		window.addEventListener('keydown', e => this.inputManager.handleKeyDown(e));
		window.addEventListener('keyup', e => this.inputManager.handleKeyUp(e));
	}

	setRaycasterEvents() {
		window.addEventListener('mousemove', e => this.raycaster.handleMouseMove(e));

		window.addEventListener('mousedown', e => {
			this.tilesStateManager.closeModal();
			this.raycaster.handleClick(e);
		});
	}

	setTowerEvents() {
		towerCreateButton.addEventListener('click', () => this.createTower());
	}

	createTower() {
		const currentTile = this.tilesStateManager.previousTileClicked;
		const currentCell = this.tilesStateManager.previousTileClicked.parent as Cell;

		const { position } = currentCell;

		this.emitter.emit('createTower', position, currentTile);
	}
}

{
	// window.addEventListener('mousedown', e => this.inputManager.handleMouseDown(e));
	// window.addEventListener('mouseup', e => this.inputManager.handleMouseUp(e));
	// window.addEventListener('mousewheel', this.inputManager.handleMouseWheel);
}
