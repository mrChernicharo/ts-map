import { InputManager } from '../core/InputManager';
import { Raycaster } from '../core/Raycaster';

const modal = document.querySelector('#tower-modal');

export class DOMManager {
  raycaster: Raycaster;
  inputManager: InputManager;
  constructor(raycaster: Raycaster, inputManager: InputManager) {
    this.raycaster = raycaster;
    this.inputManager = inputManager;

    this.setEvents();
  }

  setEvents() {
    window.addEventListener('keydown', e => this.inputManager.handleKeyDown(e));
    window.addEventListener('keyup', e => this.inputManager.handleKeyUp(e));
    {
      // window.addEventListener('mousedown', e => this.inputManager.handleMouseDown(e));
      // window.addEventListener('mouseup', e => this.inputManager.handleMouseUp(e));
      // window.addEventListener('mousewheel', this.inputManager.handleMouseWheel);
    }

    window.addEventListener('mousemove', e => this.raycaster.handleMouseMove(e));
    window.addEventListener('mousedown', e => {
      this.closeModal();
      this.raycaster.handleClick(e);
    });

    this.raycaster.raycasterEmitter.on('tileClick', e => {
      console.log('tile clicked');
      this.showModal();
    });

    const towerBtn = document.querySelector('#tower-modal button');
    towerBtn.addEventListener('click', this.createTower);
  }

  showModal() {
    modal.classList.add('visible');
  }
  closeModal() {
    modal.classList.remove('visible');
  }

  createTower() {
    console.log('create tower! Porra!');
  }
}
