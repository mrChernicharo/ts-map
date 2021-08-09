import './style.css';
import { Game } from './game/index';

const domContainer = document.querySelector('#scene-container') as HTMLDivElement;

const game = new Game(domContainer);

game.start();
