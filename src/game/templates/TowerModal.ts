import EventEmitter from 'events';
import { Tile } from '../map/Tile/Tile';
import { Tower } from '../objects/Tower/Tower';
import { CLEAR_TILE, CREATE_TOWER, TOWER_SOLD } from '../utils/constants';
import { towerModels } from '../utils/towers';

const buyModal = document.querySelector('#buy-tower-modal') as HTMLElement;
const sellModal = document.querySelector('#sell-tower-modal') as HTMLElement;
// const modalSection = document.querySelector('#tower-modal section');

const buyIcons = {};

const towerFeatIcons = {
	damage: 'fas fa-bolt',
	range: 'fas fa-circle-notch',
	fireRate: 'fas fa-meteor',
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

			button.addEventListener('mouseover', e => e.stopImmediatePropagation());
			button.addEventListener('click', e => {
				e.stopImmediatePropagation();
				this.emitter.emit(CREATE_TOWER, model);
			});
		});

		buyModal.appendChild(this.buyTowerList);
		buyModal.addEventListener('mousemove', e => {
			this.emitter.emit(CLEAR_TILE);
			e.stopImmediatePropagation();
		});
	}

	createSellModal(tower: Tower) {
		this.sellTowerDiv.innerHTML = '';

		const featSection = document.createElement('section');

		const button = document.createElement('button');
		button.classList.add('sell-button');
		button.textContent = 'Sell';

		const titleSpan = document.createElement('span');
		titleSpan.textContent = tower.towerType;

		const towerKeys = ['damage', 'fireRate', 'range'];

		Object.entries(tower)
			.filter(([key, value]) => towerKeys.includes(key))
			.forEach(([key, value]) => {
				const li = document.createElement('li');
				const span = document.createElement('span');
				const icon = document.createElement('i');

				span.textContent = String(value).toUpperCase();
				icon.setAttribute('class', towerFeatIcons[key]);

				li.appendChild(span);
				li.appendChild(icon);
				featSection.appendChild(li);
			});

		this.sellTowerDiv.appendChild(titleSpan);
		this.sellTowerDiv.appendChild(featSection);
		this.sellTowerDiv.appendChild(button);

		sellModal.appendChild(this.sellTowerDiv);

		sellModal.addEventListener('mousemove', e => {
			e.stopImmediatePropagation();
			this.emitter.emit(CLEAR_TILE);
		});
		button.addEventListener('click', e => {
			e.stopImmediatePropagation();
			this.emitter.emit(TOWER_SOLD);
		});
	}
}
