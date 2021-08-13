import { Clock, Mesh, Quaternion, Vector3, WebGL1Renderer } from 'three';
import { Camera } from './dependecies/Camera';
import { Cube } from '../helpers/objects/Cube';
import { Scene } from './Scene';
import { Ball } from '../helpers/objects/Ball';
import { levelFinish, levelStart, enemyInterval, TOWER_CREATED, TOWER_SOLD } from '../utils/constants';
import { enemyGenerator } from '../utils/functions';
import { Flag } from '../helpers/objects/Flag';
import { Enemy } from '../objects/Enemy/Enemy';
import { EventsManager } from '../managers/EventsManager';
import { Tower } from '../objects/Tower/Tower';

interface IUpdatable extends Mesh {
	tick: (delta: number) => void;
}

const clock = new Clock();
const enemyGen = enemyGenerator();
// const towerGen = towerGenerator;

class Loop {
	updatables: IUpdatable[];
	camera: Camera;
	scene: Scene;
	renderer: WebGL1Renderer;
	eventsManager: EventsManager;
	constructor(camera: Camera, scene: Scene, renderer: WebGL1Renderer, eventsManager: EventsManager) {
		this.camera = camera;
		this.scene = scene;
		this.renderer = renderer;
		this.eventsManager = eventsManager;
		this.updatables = [];
		this._init();
	}

	_init() {
		this.setEvents();

		const [startFlag, endFlag] = [new Flag(levelStart), new Flag(levelFinish)];
		this.add(startFlag);
		this.add(endFlag);
	}

	start() {
		this.renderer.setAnimationLoop(() => {
			this.tick();

			this.renderer.render(this.scene, this.camera); // render a frame
		});
	}

	stop() {
		this.renderer.setAnimationLoop(null);
	}

	add(item: any) {
		this.updatables.push(item);
		this.scene.add(item);
	}

	remove(item: any) {
		this.updatables = this.updatables.filter(u => u.uuid !== item.uuid);
		this.scene.remove(item);
		// console.log(this.updatables);
	}

	setEvents() {
		this.eventsManager.emitter.on(TOWER_CREATED, (tower: Tower) => this.add(tower));
		this.eventsManager.emitter.on(TOWER_SOLD, (tower: Tower) => this.remove(tower));
	}

	tick() {
		const delta = clock.getDelta();
		const elapsed = clock.getElapsedTime();

		this.spawnEnemies(delta, elapsed);

		// if ((elapsed % 3) + delta >= 3) {
		for (const tower of this.getTowers()) {
			for (const enemy of this.getEnemies()) {
				const distance = tower.position.distanceTo(enemy.position);
				const inRange = tower.range - distance > -10;

				if (inRange) {
					if (tower.cooldownTime < 0.1) {
						// console.log('attack');
						tower.attack(enemy);
					}
				}

				// console.log({
				// 	tower: tower.id + '.' + tower.towerType,
				// 	distance,
				// 	inRange,
				// });
			}
		}
		// console.log('----------------------------');
		// }

		this.removeDeadEnemies();

		for (const object of this.updatables) {
			object.tick(delta);
		}
	}

	spawnEnemies(delta: number, elapsed: number) {
		if ((elapsed % enemyInterval) + delta >= enemyInterval) {
			const enemy = enemyGen.next().value;

			if (enemy) this.add(enemy);
		}
	}

	removeDeadEnemies() {
		this.getEnemies()
			.filter(enemy => !enemy.isAlive())
			.forEach(enemy => this.remove(enemy));
	}

	getEnemies() {
		const enemies = this.updatables.filter(item => item.name.includes('Enemy'));
		return enemies as Enemy[];
	}

	getTowers() {
		const towers = this.updatables.filter(item => item.name.includes('Tower'));
		return towers as Tower[];
	}
}

export { Loop };
