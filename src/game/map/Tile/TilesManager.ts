import { EventEmitter } from 'events';
import { Raycaster } from '../../core/dependecies/Raycaster';
import { Tower, TowerType } from '../../objects/Tower/Tower';
import { TowerModal } from '../../templates/TowerModal';
import {
	IDLE_CLICK,
	TILE_CLICK,
	TILE_HOVER,
	IDLE_HOVER,
	TOWER_CREATED,
	TOWER_SOLD,
	CREATE_TOWER,
	CLEAR_TILE,
	DISABLE_TILE_CLICK,
	ENABLE_TILE_CLICK,
} from '../../utils/constants';
import { random } from '../../utils/functions';

import { Cell } from '../Land/Cell';
import { Tile } from './Tile';

export class TilesManager {
	raycaster: Raycaster;
	previousTileClicked: Tile;
	previousTileHovered: Tile;
	emitter: EventEmitter;
	towerModal: TowerModal;
	canClick = true;

	constructor(raycaster: Raycaster) {
		this.raycaster = raycaster;
		this._init();

		this._setEvents();
	}
	_init() {
		this.previousTileClicked = null;
		this.previousTileHovered = null;
		this.emitter = new EventEmitter();
		this.towerModal = new TowerModal();
	}

	_setEvents() {
		this.raycaster.emitter.on(TILE_CLICK, (tile: Tile) => this.handleTileClick(tile));
		this.raycaster.emitter.on(TILE_HOVER, (tile: Tile) => this.handleTileHover(tile));
		this.raycaster.emitter.on(IDLE_CLICK, () => this.clearTileSelection());
		this.raycaster.emitter.on(IDLE_HOVER, () => this.clearTileHover());

		this.towerModal.emitter.on(CREATE_TOWER, (towerType: TowerType) => this.createTower(towerType));
		this.towerModal.emitter.on(TOWER_SOLD, () => this.sellTower());
		this.towerModal.emitter.on(CLEAR_TILE, () => this.clearTileHover());

		this.towerModal.emitter.on(DISABLE_TILE_CLICK, () => {
			this.canClick = false;
		});
		this.towerModal.emitter.on(ENABLE_TILE_CLICK, () => {
			this.canClick = true;
		});
	}

	handleTileClick(tile: Tile) {
		if (!this.canClick) return;

		if (tile.state === 'hovered' || tile.state === 'idle') {
			tile.setState('selected');

			if (tile.tower) {
				tile.tower.highlight();

				if (this.previousTileClicked?.tower !== tile.tower) {
					this.previousTileClicked?.tower?.removeHighlight();
				}
			}
			if (!tile.tower) {
				this.previousTileClicked?.tower?.removeHighlight();
			}

			this.towerModal.open(tile);

			// remove highlight
			if (this.previousTileClicked !== tile) this.previousTileClicked?.setState('idle');

			this.previousTileClicked = tile;

			return;
		}

		if (tile.state === 'selected') {
			tile.setState('idle');
			this.previousTileClicked?.tower?.removeHighlight();

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

	createTower(towerType: TowerType) {
		const tile = this.previousTileClicked;
		const currentCell = this.previousTileClicked.parent as Cell;

		if (tile.tower) return;

		const { position } = currentCell;

		const tower = new Tower(position, tile, towerType);

		tile.addTower(tower);

		this.emitter.emit(TOWER_CREATED, tower);
	}

	sellTower() {
		const tile = this.previousTileClicked;

		this.emitter.emit(TOWER_SOLD, tile.tower);

		tile.tower = null;
	}
}
