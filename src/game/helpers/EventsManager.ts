import { InputManager } from '../core/InputManager';
import { Raycaster } from '../core/Raycaster';
import { Tile } from '../map/Tile';
import { TilesStateManager } from './TilesStateManager';

const modal = document.querySelector('#tower-modal');
const modalSection = document.querySelector('#tower-modal section');
const createTowerButton = document.querySelector('#tower-modal button');

export class EventsManager {
  inputManager: InputManager;
  raycaster: Raycaster;

  constructor(raycaster: Raycaster, inputManager: InputManager) {
    this.raycaster = raycaster;
    this.inputManager = inputManager;

    this.initTilesStateManager();

    this.setWindowEvents();
    this.setRaycasterEvents();

    this.setEvents();
  }

  initTilesStateManager() {
    new TilesStateManager(this.raycaster);
  }

  setWindowEvents() {
    window.addEventListener('keydown', e => this.inputManager.handleKeyDown(e));
    window.addEventListener('keyup', e => this.inputManager.handleKeyUp(e));
  }

  setRaycasterEvents() {
    window.addEventListener('mousemove', e => this.raycaster.handleMouseMove(e));

    window.addEventListener('mousedown', e => {
      this.closeModal();
      this.raycaster.handleClick(e);
    });
  }

  setEvents() {
    createTowerButton.addEventListener('click', this.createTower);
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
