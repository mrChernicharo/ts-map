import { Player } from '../core/dependecies/Player';
import { playerIcons } from '../utils/constants';

const playerDiv = document.querySelector('#player-stats') as HTMLElement;

export class PlayerStats {
	lifeElements: HTMLLIElement[];
	moneySpan: HTMLSpanElement;
	money: number;
	lifePoints: number;
	constructor(initialMoney: number, lifePoints: number) {
		this.money = initialMoney;
		this.lifePoints = lifePoints;
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

		for (let i = 0; i < this.lifePoints; i++) {
			const lifeLi = document.createElement('li');
			lifeLi.setAttribute('class', 'life-icon empty');

			const lifeIcon = document.createElement('i');
			lifeIcon.setAttribute('class', playerIcons.life);

			lifeLi.appendChild(lifeIcon);
			lifeUl.appendChild(lifeLi);
		}

		playerDiv.append(lifeUl, moneySection);

		this.lifeElements = Array.from(lifeUl.children) as HTMLLIElement[];
		this.moneySpan = moneySpan;

		console.log(this.lifeElements);
	}

	toggleLifeIcon(index: number) {
		const icon = this.lifeElements[index];

		icon.classList.toggle('empty');
		icon.classList.toggle('filled');
	}

	updateLifePoints(value: number) {
		this.lifePoints += value; // value == -1

		console.log(this.lifePoints);

		if (value < 0) {
			this.removeLifePoint();
		} else if (value > 0) {
			//
		}

		if (this.lifePoints === 0) {
			console.log('you lose!');
			console.log('you lose!');
			console.log('you lose!');
			console.log('you lose!');
			console.log('you lose!');

			setInterval(() => window.location.assign('/'), 8000);

			return;
		}
	}

	removeLifePoint() {
		if (this.lifePoints > -1) {
			this.toggleLifeIcon(this.lifePoints);
		}
	}

	updateMoney(value: number) {
		this.money += value;
		this.moneySpan.textContent = String(this.money);
	}
}
