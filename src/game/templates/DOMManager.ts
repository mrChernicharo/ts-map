import { InputManager } from '../core/InputManager';
import { Raycaster } from '../core/Raycaster';
import { Tile } from '../map/Tile';

const modal = document.querySelector('#tower-modal');
const modalSection = document.querySelector('#tower-modal section');
const createTowerButton = document.querySelector('#tower-modal button');

export class DOMManager {
  raycaster: Raycaster;
  inputManager: InputManager;
  previousSelection;
  constructor(raycaster: Raycaster, inputManager: InputManager) {
    this.raycaster = raycaster;
    this.inputManager = inputManager;
    this.previousSelection = null;

    this.setWindowEvents();
    this.setEvents();
  }

  setWindowEvents() {
    window.addEventListener('keydown', e => this.inputManager.handleKeyDown(e));
    window.addEventListener('keyup', e => this.inputManager.handleKeyUp(e));

    window.addEventListener('mousemove', e => this.raycaster.handleMouseMove(e));

    window.addEventListener('mousedown', e => {
      this.closeModal();
      this.raycaster.handleClick(e);
    });
  }

  setEvents() {
    this.raycaster.raycasterEmitter.on('tileClick', (tile: Tile) => {
      this.setTileState(tile);

      this.showModal(tile);
    });

    this.raycaster.raycasterEmitter.on('tileHover', (tile: Tile) => {
      if (tile.state !== 'selected') tile.setState('hovered');
    });

    createTowerButton.addEventListener('click', this.createTower);
  }

  setTileState(tile) {
    if (tile.state === 'hovered') {
      tile.setState('selected');

      if (this.previousSelection) this.previousSelection.setState('idle');

      this.previousSelection = tile;

      return;
    }

    if (tile.state === 'selected') {
      console.log(this.previousSelection);
      tile.setState('hovered');
      return;
    }
  }

  showModal(tile: Tile) {
    modal.classList.add('visible');

    const tileInfo = `${tile.name} ${tile.id}`;

    modalSection.innerHTML = tileInfo;
  }
  closeModal() {
    modal.classList.remove('visible');
  }

  createTower() {
    console.log('create tower! Porra!');
  }
}

{
  // window.addEventListener('mousedown', e => this.inputManager.handleMouseDown(e));
  // window.addEventListener('mouseup', e => this.inputManager.handleMouseUp(e));
  // window.addEventListener('mousewheel', this.inputManager.handleMouseWheel);
}
