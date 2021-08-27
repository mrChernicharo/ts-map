const loadingScreen = document.querySelector('#loading-screen');

const spinnerSvg = '/assets/svg/spinner.svg';

export class LoadingScreen {
	constructor() {
		this._init();
	}
	_init() {
		const loadingTxt = document.createElement('h2');
		loadingTxt.textContent = 'Generating Maze...';

		const spinner = document.createElement('img');
		spinner.setAttribute('src', spinnerSvg);

		loadingScreen.append(loadingTxt, spinner);
	}

	done() {
		loadingScreen.classList.add('done');
	}
}
