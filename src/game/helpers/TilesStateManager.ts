import { EventEmitter } from 'stream';
import { Raycaster } from '../core/Raycaster';
import { Tile } from '../map/Tile';

const modal = document.querySelector('#tower-modal');
const modalSection = document.querySelector('#tower-modal section');

export class TilesStateManager {
  raycaster: Raycaster;
  previousTileClicked: Tile;
  previousTileHovered: Tile;
  constructor(raycaster: Raycaster) {
    this.raycaster = raycaster;
    this.previousTileClicked = null;
    this.previousTileHovered = null;

    this.setEvents();
  }

  setEvents() {
    this.raycaster.raycasterEmitter.on('tileClick', (tile: Tile) => this.handleTileClick(tile));
    this.raycaster.raycasterEmitter.on('tileHover', (tile: Tile) => this.handleTileHover(tile));
    this.raycaster.raycasterEmitter.on('idleClick', () => this.clearTileSelection());
    this.raycaster.raycasterEmitter.on('idleHover', () => this.clearTileHover());
  }

  handleTileClick(tile: Tile) {
    if (tile.state === 'hovered' || tile.state === 'idle') {
      tile.setState('selected');

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
    this.previousTileClicked?.setState('idle');
  }

  clearTileHover() {
    if (this.previousTileHovered?.state !== 'selected') this.previousTileHovered?.setState('idle');
  }

  showModal(tile: Tile) {
    modal.classList.add('visible');

    const tileInfo = `${tile.name} ${tile.id}`;

    modalSection.innerHTML = tileInfo;
  }
}
