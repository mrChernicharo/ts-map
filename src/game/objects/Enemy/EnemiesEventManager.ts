import { EventEmitter } from 'stream';
import { MeshToonMaterial } from 'three';
import { Raycaster } from '../../core/dependecies/Raycaster';
import { ENEMY_CLICK, ENEMY_HOVER, random } from '../../utils/constants';
import { Tower } from '../Tower/Tower';
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

	// createTower(position, currentTile) {
	// 	const types = ['A', 'B'];
	// 	const towerType = types[random(0, 1)];

	// 	const tower = new Tower(position, currentTile, towerType);
	// 	return tower;
	// }
}
