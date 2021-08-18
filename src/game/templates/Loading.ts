const loadingScreen = document.querySelector('#loading-screen');

export class LoadingScreen {
	constructor() {
		this._init();
	}
	_init() {
		const loadingTxt = document.createElement('h2');
		loadingTxt.textContent = 'Loading...';

		loadingScreen.append(loadingTxt);
	}

	done() {
		loadingScreen.classList.add('done');
	}
}
