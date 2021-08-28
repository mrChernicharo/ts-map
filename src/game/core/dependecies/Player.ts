import { EventsManager } from '../../managers/EventsManager';
import { Tower } from '../../objects/Tower/Tower';
import { GameOverBanner } from '../../templates/GameOverBanner';
import { PlayerStats } from '../../templates/PlayerStats';
import { PLAYER_LIVES, GAME_READY, TOWER_CREATED, TOWER_SOLD } from '../../utils/constants';
import { towerModels } from '../../utils/towers';

export class Player {
	life = PLAYER_LIVES;
	gold = 120;
	statsPanel: PlayerStats;
	eventsManager: EventsManager;
	constructor(eventsManager: EventsManager) {
		this.statsPanel = new PlayerStats(this.gold, PLAYER_LIVES);
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
		this.statsPanel.lifeElements.forEach((icon, i) => {
			setTimeout(() => {
				this.statsPanel.toggleLifeIcon(i);
			}, 200 * i);
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

		if (this.life === 0) {
			new GameOverBanner();
		}
	}
}
