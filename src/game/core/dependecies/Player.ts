import { PlayerStats } from '../../templates/PlayerStats';

export class Player {
	life = 10;
	gold = 90;
	statsPanel: PlayerStats;
	constructor() {
		this._init();
	}

	_init() {
		this.appendPlayerStats();
	}

	appendPlayerStats() {
		this.statsPanel = new PlayerStats();
	}
}
