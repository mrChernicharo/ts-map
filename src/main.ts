import './styles/global.css';
import './styles/modal.css';
import './styles/loading.css';
import './styles/playerStats.css';

import { Game } from './game/index';

const domContainer = document.querySelector('#scene-container') as HTMLDivElement;

const game = new Game(domContainer);

game.start();
