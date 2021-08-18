import './game/styles/global.css';
import { Game } from './game/index';
// import { Title } from './game/templates/title';

const domContainer = document.querySelector('#scene-container') as HTMLDivElement;

const game = new Game(domContainer);

game.start();
