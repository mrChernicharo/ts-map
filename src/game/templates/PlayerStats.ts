import { Player } from '../core/dependecies/Player';
import { playerIcons } from '../utils/constants';

const playerDiv = document.querySelector('#player-stats') as HTMLElement;
const playerLife = 10;

export class PlayerStats {
	constructor() {
		this._initTemplate();
	}

	_initTemplate() {
		const lifeUl = document.createElement('ul');
		const moneySection = document.createElement('section');

		const moneyIcon = document.createElement('i');
		moneyIcon.setAttribute('class', playerIcons.gold);

		const moneySpan = document.createElement('span');
		moneySpan.textContent = String(90);

		moneySection.append(moneyIcon, moneySpan);

		for (let i = 0; i < playerLife; i++) {
			const lifeLi = document.createElement('li');
			const lifeIcon = document.createElement('i');
			lifeIcon.setAttribute('class', playerIcons.life);

			lifeLi.appendChild(lifeIcon);
			lifeUl.appendChild(lifeLi);
		}

		playerDiv.append(lifeUl, moneySection);
	}

	updateLifePoints() {}

	updateMoney(value: number) {}
}
