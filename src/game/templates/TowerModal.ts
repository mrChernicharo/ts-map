import EventEmitter from 'events';
import { Tile } from '../map/Tile/Tile';
import { Tower } from '../objects/Tower/Tower';
import {
	buyModalIcons,
	CLEAR_TILE,
	CREATE_TOWER,
	sellModalIcons,
	towerFeatIcons,
	TOWER_SOLD,
} from '../utils/constants';
import { towerModels } from '../utils/towers';

const buyModal = document.querySelector('#buy-tower-modal') as HTMLElement;
const sellModal = document.querySelector('#sell-tower-modal') as HTMLElement;
// const modalSection = document.querySelector('#tower-modal section');

export class TowerModal {
	emitter: EventEmitter;
	buyTowerList: HTMLUListElement;
	sellTowerDiv: HTMLDivElement;
	constructor() {
		this._initTemplate();
	}

	_initTemplate() {
		this.emitter = new EventEmitter();

		this._createBuyModal();
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
	_createBuyModal() {
		this.buyTowerList = document.createElement('ul');
		this.sellTowerDiv = document.createElement('div');
		this.buyTowerList.classList.add('buy-tower-list');
		this.sellTowerDiv.classList.add('sell-tower-list');

		Object.keys(towerModels).forEach(model => {
			const outerLi = document.createElement('li');
			const button = document.createElement('button');
			const img = document.createElement('img');

			img.src = `/assets/img/${model}.png`;

			const priceDiv = document.createElement('div');
			priceDiv.classList.add('price-div');

			const priceIcon = document.createElement('i');
			priceIcon.setAttribute('class', buyModalIcons.price);

			const priceSpan = document.createElement('span');
			priceSpan.textContent = towerModels[model].price;

			priceDiv.append(priceIcon, priceSpan);

			button.append(img, priceDiv);
			outerLi.appendChild(button);
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

		const buttonIcon = document.createElement('i');
		buttonIcon.setAttribute('class', sellModalIcons.price);

		const buttonSpan = document.createElement('span');
		buttonSpan.textContent = 'Sell';

		const towerPriceSpan = document.createElement('span');
		towerPriceSpan.classList.add('tower-price');
		towerPriceSpan.textContent = String(towerModels[tower.towerType].sellPrice());

		const priceDiv = document.createElement('div');
		priceDiv.append(buttonIcon, towerPriceSpan);

		button.append(buttonSpan, priceDiv);

		const titleSpan = document.createElement('span');
		titleSpan.textContent = towerModels[tower.towerType].title.toUpperCase();

		const towerKeys = ['damage', 'fireRate', 'range'];

		Object.entries(tower)
			.filter(([key, value]) => towerKeys.includes(key))
			.forEach(([key, value]) => {
				const li = document.createElement('li');
				const span = document.createElement('span');
				const icon = document.createElement('i');

				span.textContent = String(value);
				icon.setAttribute('class', towerFeatIcons[key]);

				li.appendChild(icon);
				li.appendChild(span);
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
