import EventEmitter from 'events';
import { Tile } from '../map/Tile/Tile';
import { CREATE_TOWER } from '../utils/constants';
import { towerModels } from '../utils/towers';

const modal = document.querySelector('#tower-modal');
const modalSection = document.querySelector('#tower-modal section');
const towerFeats = {
	damage: '🗡',
	fireRate: '⏱',
	range: '📐',
	price: '💰',
};

export class TowerModal {
	ul: HTMLUListElement;
	emitter: EventEmitter;
	constructor(tile?: Tile) {
		this._initTemplate();
	}

	_initTemplate() {
		this.emitter = new EventEmitter();
		this.ul = document.createElement('ul');
		this.ul.classList.add('tower-list');
		this.appendTowerButtons();
	}

	open() {
		modal.classList.add('visible');
	}

	close() {
		modal.classList.remove('visible');
	}

	appendTowerButtons() {
		Object.keys(towerModels).forEach(model => {
			const outerLi = document.createElement('li');

			const button = document.createElement('button');
			button.addEventListener('click', e => this.emitter.emit(CREATE_TOWER, model));

			const img = document.createElement('img');
			img.src = `assets/img/${model}.png`;

			const ul = document.createElement('ul');
			ul.classList.add('tower-feats');

			const towerKeys = Object.keys(towerFeats);

			Object.entries(towerModels[model])
				.filter(([key, value]) => towerKeys.includes(key))
				.forEach(([key, value]) => {
					const li = document.createElement('li');
					const kspan = document.createElement('span');
					const vspan = document.createElement('span');

					kspan.textContent = towerFeats[key];
					vspan.textContent = String(value);

					li.appendChild(kspan);
					li.appendChild(vspan);
					ul.appendChild(li);
				});

			button.appendChild(img);
			outerLi.appendChild(button);
			outerLi.appendChild(ul);
			this.ul.appendChild(outerLi);
		});

		modalSection.appendChild(this.ul);
	}
}
