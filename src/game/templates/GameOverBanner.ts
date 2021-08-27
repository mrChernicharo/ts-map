const gameOverEl = document.querySelector('#game-over-banner');
const overlay = document.querySelector('#overlay');

export class GameOverBanner {
	constructor() {
		const h1 = document.createElement('h1');
		h1.textContent = 'Game Over';

		gameOverEl.append(h1);

		overlay.classList.add('show');
		gameOverEl.classList.add('visible');
	}
}
