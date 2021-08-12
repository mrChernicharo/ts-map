import { EventEmitter } from 'events';
import { Raycaster } from '../../core/dependecies/Raycaster';
import { Tower, TowerType } from '../../objects/Tower/Tower';
import {
	IDLE_CLICK,
	TILE_CLICK,
	TILE_HOVER,
	IDLE_HOVER,
	TOWER_CREATED,
	TOWER_SOLD,
} from '../../utils/constants';
import { random } from '../../utils/functions';

import { Cell } from '../Land/Cell';
import { Tile } from './Tile';

const modal = document.querySelector('#tower-modal');
const modalSection = document.querySelector('#tower-modal section');
const towerCreateButton = document.querySelector('#tower-modal button');

export class TilesEventManager {
	raycaster: Raycaster;
	previousTileClicked: Tile;
	previousTileHovered: Tile;
	emitter: EventEmitter;
	constructor(raycaster: Raycaster) {
		this.raycaster = raycaster;
		this._init();

		this._setEvents();
	}
	_init() {
		this.previousTileClicked = null;
		this.previousTileHovered = null;
		this.emitter = new EventEmitter();
	}

	_setEvents() {
		this.raycaster.emitter.on(TILE_CLICK, (tile: Tile) => this.handleTileClick(tile));
		this.raycaster.emitter.on(TILE_HOVER, (tile: Tile) => this.handleTileHover(tile));
		this.raycaster.emitter.on(IDLE_CLICK, () => this.clearTileSelection());
		this.raycaster.emitter.on(IDLE_HOVER, () => this.clearTileHover());
		towerCreateButton.addEventListener('click', (e: PointerEvent) => this.handleModalButtonClick(e));
	}

	handleTileClick(tile: Tile) {
		if (tile.state === 'hovered' || tile.state === 'idle') {
			tile.setState('selected');

			if (tile.tower) tile.tower.highlight();

			if (this.previousTileClicked !== tile) this.previousTileClicked?.setState('idle');

			this.previousTileClicked = tile;

			return this.showModal(tile);
		}

		if (tile.state === 'selected') {
			tile.setState('hovered');

			return;
		}
	}

	handleTileHover(tile: Tile) {
		if (tile.state === 'idle') tile.setState('hovered');

		if (this.previousTileHovered !== tile && this.previousTileHovered?.state !== 'selected')
			this.previousTileHovered?.setState('idle');

		this.previousTileHovered = tile;
	}

	handleModalButtonClick(e: PointerEvent) {
		const buttonAction = (e.target as HTMLButtonElement).textContent;

		buttonAction === 'Build Tower' ? this.createTower() : this.sellTower();
	}

	clearTileSelection() {
		const tile = this.previousTileClicked;

		if (tile) {
			tile.setState('idle');
			tile.tower?.removeHighlight();
		}
	}

	clearTileHover() {
		if (this.previousTileHovered?.state !== 'selected') this.previousTileHovered?.setState('idle');
	}

	createTower() {
		const tile = this.previousTileClicked;
		const currentCell = this.previousTileClicked.parent as Cell;

		const { position } = currentCell;

		const towerTypes: TowerType[] = ['A', 'B', 'C'];
		const towerType = towerTypes[random(0, 2)];

		const tower = new Tower(position, tile, towerType);

		tile.addTower(tower);

		this.emitter.emit(TOWER_CREATED, tower);
	}

	sellTower() {
		const tile = this.previousTileClicked;

		this.emitter.emit(TOWER_SOLD, tile.tower);

		tile.tower = null;
	}

	showModal(tile: Tile) {
		modal.classList.add('visible');

		const tileInfo = `${tile.name}  ${tile.buildPoint}`;
		const buttonContent = tile.tower?.selected ? 'Sell Tower' : 'Build Tower';

		modalSection.innerHTML = tileInfo;
		towerCreateButton.innerHTML = buttonContent;
	}

	closeModal() {
		modal.classList.remove('visible');
	}
}
