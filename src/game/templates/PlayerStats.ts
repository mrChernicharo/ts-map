import { Player } from '../core/dependecies/Player';
import { playerIcons } from '../utils/constants';

const playerDiv = document.querySelector('#player-stats') as HTMLElement;
const playerLife = 10;

export class PlayerStats {
	lifeItems: HTMLLIElement[];
	moneySpan: HTMLSpanElement;
	money: number;
	constructor(initialMoney: number) {
		this.money = initialMoney;
		this._initTemplate();
	}

	_initTemplate() {
		const lifeUl = document.createElement('ul');
		const moneySection = document.createElement('section');

		const moneyIcon = document.createElement('i');
		moneyIcon.setAttribute('class', playerIcons.gold);

		const moneySpan = document.createElement('span');
		moneySpan.textContent = String(this.money);

		moneySection.append(moneyIcon, moneySpan);

		for (let i = 0; i < playerLife; i++) {
			const lifeLi = document.createElement('li');
			lifeLi.setAttribute('class', 'life-icon empty');

			const lifeIcon = document.createElement('i');
			lifeIcon.setAttribute('class', playerIcons.life);

			lifeLi.appendChild(lifeIcon);
			lifeUl.appendChild(lifeLi);
		}

		playerDiv.append(lifeUl, moneySection);

		this.lifeItems = Array.from(lifeUl.children) as HTMLLIElement[];
		this.moneySpan = moneySpan;

		console.log(this.lifeItems);
	}

	toggleLifeIcon(index: number) {
		const icon = this.lifeItems[index];

		icon.classList.toggle('empty');
		icon.classList.toggle('filled');
	}

	updateLifePoints(value: number) {
		console.log(`update life by ${value}`);
	}

	updateMoney(value: number) {
		this.money += value;
		this.moneySpan.textContent = String(this.money);
	}
}
