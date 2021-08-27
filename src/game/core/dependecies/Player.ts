import { EventsManager } from '../../managers/EventsManager';
import { Tower } from '../../objects/Tower/Tower';
import { PlayerStats } from '../../templates/PlayerStats';
import { GAME_READY, TOWER_CREATED } from '../../utils/constants';
import { towerModels } from '../../utils/towers';

export class Player {
	life = 10;
	gold = 120;
	statsPanel: PlayerStats;
	eventsManager: EventsManager;
	constructor(eventsManager: EventsManager) {
		this.statsPanel = new PlayerStats(this.gold);
		this.eventsManager = eventsManager;
		this._init();
	}

	_init() {
		this.eventsManager.emitter.on(GAME_READY, () => this._initStats());
		this.eventsManager.emitter.on(TOWER_CREATED, (tower: Tower) => {
			this.subtracMoney(towerModels[tower.towerType].price);
		});
	}

	_initStats() {
		const fillLifeIcons = (icon: HTMLLIElement) => {
			icon.classList.remove('empty');
			icon.classList.add('filled');
		};

		this.statsPanel.lifeItems.forEach((icon, i) => {
			setTimeout(() => fillLifeIcons(icon), 60 * i);
		});
	}

	addMoney(value: number) {
		this.gold += value;
		// this.statsPanel
	}
	subtracMoney(value: number) {
		this.gold -= value;
		console.log('gold ', this.gold, this.statsPanel, this);

		this.statsPanel.updateMoney(-value);
	}

	addLife(value = 1) {
		this.life += value;
		// this.statsPanel
	}
	subtracLife(value = 1) {
		this.life -= value;
		// this.statsPanel
	}
}
