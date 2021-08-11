import { EventEmitter } from 'stream';
import { Raycaster } from '../../core/Raycaster';
import { Enemy } from './Enemy';

export class EnemiesEventManager {
	raycaster: Raycaster;
	previousEnemyClicked: Enemy;
	previousEnemyHovered: Enemy;
	constructor(raycaster: Raycaster) {
		this.raycaster = raycaster;
		this.previousEnemyClicked = null;
		this.previousEnemyHovered = null;

		this.setEvents();
	}

	setEvents() {
		this.raycaster.raycasterEmitter.on('enemyClick', (enemy: Enemy) => this.handleEnemyClick(enemy));
		this.raycaster.raycasterEmitter.on('enemyHover', (enemy: Enemy) => this.handleEnemyHover(enemy));
		this.raycaster.raycasterEmitter.on('idleClick', () => this.clearEnemySelection());
		this.raycaster.raycasterEmitter.on('idleHover', () => this.clearEnemyHover());
	}

	handleEnemyClick(enemy: Enemy) {
		// console.log({ enemy, prev: this.previousEnemyClicked });
		this.previousEnemyClicked = enemy;
	}

	handleEnemyHover(enemy: Enemy) {
		this.previousEnemyHovered = enemy;
	}

	clearEnemySelection() {}

	clearEnemyHover() {}
}
