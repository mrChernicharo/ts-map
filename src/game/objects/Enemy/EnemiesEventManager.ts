import { EventEmitter } from 'events';
import { Raycaster } from '../../core/dependecies/Raycaster';
import { ENEMY_CLICK, ENEMY_HOVER, HURT_PLAYER } from '../../utils/constants';
import { random } from '../../utils/functions';
import { Enemy } from './Enemy';

export class EnemiesEventManager {
	raycaster: Raycaster;
	previousEnemyClicked: Enemy;
	previousEnemyHovered: Enemy;
	emitter: EventEmitter;
	constructor(raycaster: Raycaster) {
		this.raycaster = raycaster;
		this._init();
	}

	_init() {
		this.previousEnemyClicked = null;
		this.previousEnemyHovered = null;
		this.emitter = new EventEmitter();

		this._setEvents();
	}

	_setEvents() {
		this.raycaster.emitter.on(ENEMY_CLICK, (enemy: Enemy) => this.handleEnemyClick(enemy));
		this.raycaster.emitter.on(ENEMY_HOVER, (enemy: Enemy) => this.handleEnemyHover(enemy));
	}

	handleEnemyClick(enemy: Enemy) {
		// console.log({ enemy, prev: this.previousEnemyClicked });// test that it works
		enemy.die();
		this.previousEnemyClicked = enemy;
	}

	handleEnemyHover(enemy: Enemy) {
		// enemy.material = new MeshToonMaterial({ color: 0x0000ff }); // test that it works!
		this.previousEnemyHovered = enemy;
	}

	clearEnemySelection() {}

	clearEnemyHover() {}
}
