import EventEmitter from 'events';
import { Tile } from '../map/Tile/Tile';
import { Tower } from '../objects/Tower/Tower';
import { CREATE_TOWER, TOWER_SOLD } from '../utils/constants';
import { towerModels } from '../utils/towers';

const buyModal = document.querySelector('#buy-tower-modal');
const sellModal = document.querySelector('#sell-tower-modal');
// const modalSection = document.querySelector('#tower-modal section');
const towerFeats = {
	range: '📐',
	damage: '🗡',
	fireRate: '⏱',
	price: '💰',
};

export class TowerModal {
	emitter: EventEmitter;
	buyTowerList: HTMLUListElement;
	sellTowerDiv: HTMLDivElement;
	constructor() {
		this._initTemplate();
	}

	_initTemplate() {
		this.emitter = new EventEmitter();
		this.buyTowerList = document.createElement('ul');
		this.sellTowerDiv = document.createElement('div');
		this.buyTowerList.classList.add('buy-tower-list');
		this.sellTowerDiv.classList.add('sell-tower-list');
		this.createBuyModal();
	}

	open(tile: Tile) {
		if (tile.tower) {
			sellModal.classList.add('visible');
			this.createSellModal(tile.tower);
		} else {
			buyModal.classList.add('visible');
		}
	}

	close() {
		buyModal.classList.remove('visible');
		sellModal.classList.remove('visible');
	}

	// depend on the towerModels list only
	createBuyModal() {
		Object.keys(towerModels).forEach(model => {
			const outerLi = document.createElement('li');
			const button = document.createElement('button');
			const img = document.createElement('img');

			button.addEventListener('click', e => this.emitter.emit(CREATE_TOWER, model));

			img.src = `assets/img/${model}.png`;

			const price = document.createElement('div');
			const priceSpan = document.createElement('span');
			priceSpan.textContent = towerModels[model].price;

			price.append(priceSpan);

			button.appendChild(img);
			button.appendChild(price);
			outerLi.appendChild(button);

			// outerLi.appendChild(ul);
			this.buyTowerList.appendChild(outerLi);
		});

		buyModal.appendChild(this.buyTowerList);
	}

	createSellModal(tower: Tower) {
		this.sellTowerDiv.innerHTML = '';

		const featSection = document.createElement('section');

		const button = document.createElement('button');
		button.textContent = 'Sell';
		button.addEventListener('click', e => this.emitter.emit(TOWER_SOLD));

		const titleSpan = document.createElement('span');
		titleSpan.textContent = tower.towerType;

		const towerKeys = ['damage', 'fireRate', 'range'];

		Object.entries(tower)
			.filter(([key, value]) => towerKeys.includes(key))
			.forEach(([key, value]) => {
				const li = document.createElement('li');
				const kspan = document.createElement('span');
				const vspan = document.createElement('span');

				kspan.textContent = String(value);
				vspan.textContent = towerFeats[key];

				li.appendChild(kspan);
				li.appendChild(vspan);
				featSection.appendChild(li);
			});

		this.sellTowerDiv.appendChild(titleSpan);
		this.sellTowerDiv.appendChild(featSection);
		this.sellTowerDiv.appendChild(button);
		sellModal.appendChild(this.sellTowerDiv);
	}
}
