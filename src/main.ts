import './style.css';
import { Game } from './game/index';

const domContainer = document.querySelector('#scene-container') as HTMLDivElement;

const game = new Game(domContainer);

game.start();

const towerBtn = document.querySelector('#tower-modal button');
towerBtn.addEventListener('click', createTower);
function createTower() {
  console.log('create tower!');
}
