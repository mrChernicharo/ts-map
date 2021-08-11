import { EventEmitter } from 'events';
import { Raycaster } from '../../core/dependecies/Raycaster';
import { Tower } from '../../objects/Tower/Tower';
import { IDLE_CLICK, TILE_CLICK, TILE_HOVER, IDLE_HOVER, random, TOWER_CREATED } from '../../utils/constants';
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
		this.previousTileClicked = null;
		this.previousTileHovered = null;
		this.emitter = new EventEmitter();

		this.setEvents();
	}

	setEvents() {
		this.raycaster.emitter.on(TILE_CLICK, (tile: Tile) => this.handleTileClick(tile));
		this.raycaster.emitter.on(TILE_HOVER, (tile: Tile) => this.handleTileHover(tile));
		this.raycaster.emitter.on(IDLE_CLICK, () => this.clearTileSelection());
		this.raycaster.emitter.on(IDLE_HOVER, () => this.clearTileHover());
		towerCreateButton.addEventListener('click', () => this.createTower());
	}

	handleTileClick(tile: Tile) {
		if (tile.state === 'hovered' || tile.state === 'idle') {
			tile.setState('selected');

			if (tile.tower) {
				tile.tower.highlight();
			}

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

		const towerTypes = ['A', 'B', 'C'];
		const towerType = towerTypes[random(0, 2)];

		const tower = new Tower(position, tile, towerType);

		tile.addTower(tower);

		this.emitter.emit(TOWER_CREATED, tower);
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
