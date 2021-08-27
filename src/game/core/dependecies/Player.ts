import { EventsManager } from '../../managers/EventsManager';
import { Tower } from '../../objects/Tower/Tower';
import { PlayerStats } from '../../templates/PlayerStats';
import { GAME_READY, TOWER_CREATED, TOWER_SOLD } from '../../utils/constants';
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
		this.eventsManager.emitter.on(TOWER_SOLD, (tower: Tower) => {
			this.addMoney(towerModels[tower.towerType].sellPrice());
		});
	}

	_initStats() {
		this.statsPanel.lifeItems.forEach((icon, i) => {
			setTimeout(() => {
				this.statsPanel.toggleLifeIcon(i);
			}, 60 * i);
		});
	}

	addMoney(value: number) {
		this.gold += value;
		this.statsPanel.updateMoney(value);
	}
	subtracMoney(value: number) {
		this.gold -= value;
		this.statsPanel.updateMoney(-value);
	}

	addLife(value = 1) {
		this.life += value;
		this.statsPanel.updateLifePoints(value);
	}
	subtracLife(value = 1) {
		this.life -= value;
		this.statsPanel.updateLifePoints(-value);
	}
}
