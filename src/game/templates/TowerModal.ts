import EventEmitter from 'events';
import { Tile } from '../map/Tile/Tile';
import { CREATE_TOWER } from '../utils/constants';
import { towerModels } from '../utils/towers';

const modal = document.querySelector('#tower-modal');
const modalSection = document.querySelector('#tower-modal section');
const towerCreateButton = document.querySelector('#tower-modal button');

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
		Object.keys(towerModels).forEach(key => {
			const li = document.createElement('li');
			const button = document.createElement('button');

			button.textContent = key;
			button.addEventListener('click', e => this.emitter.emit(CREATE_TOWER, key));

			li.appendChild(button);
			this.ul.appendChild(li);
		});

		modalSection.appendChild(this.ul);
	}
}

// const modalTemplate = `
//     <div id="tower-modal">
//         <h2>Tower Build</h2>
//         <main>Tower Name</main>
//         <button>Create Tower!</button>
//     </div>`;
// this.container.innerHTML += modalTemplate;
