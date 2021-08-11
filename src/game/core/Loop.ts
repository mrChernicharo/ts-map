import { Clock, Mesh, Quaternion, Vector3, WebGL1Renderer } from 'three';
import { Camera } from './Camera';
import { Cube } from '../helpers/Cube';
import { Scene } from './Scene';
import { Ball } from '../helpers/Ball';
import { towerGenerator, enemyGenerator, levelFinish, levelStart, random } from '../utils/constants';
import { Flag } from '../helpers/Flag';
import { Enemy } from '../objects/Enemy/Enemy';
import { EventsManager } from '../managers/EventsManager';
import { Tower } from '../objects/Tower/Tower';

interface IUpdatable extends Mesh {
	tick: (delta: number) => void;
}

const clock = new Clock();
const enemyGen = enemyGenerator(100);
const towerGen = towerGenerator;
const enemyInterval = 4;

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
		// console.log(this);
	}

	setUp() {
		const [startFlag, endFlag] = [new Flag(levelStart), new Flag(levelFinish)];
		this.add(startFlag);
		this.add(endFlag);

		this.eventsManager.emitter.on('createTower', (pos, position) => {
			const types = ['A', 'B'];
			const towerType = types[random(0, 1)];

			const tower = new Tower(pos, position, towerType);
			this.add(tower);
		});
	}

	start() {
		this.renderer.setAnimationLoop(() => {
			this.tick();

			// render a frame
			this.renderer.render(this.scene, this.camera);
		});
	}

	stop() {
		this.renderer.setAnimationLoop(null);
	}

	add(item: any) {
		this.updatables.push(item);
		this.scene.add(item);
	}

	remove() {}

	tick() {
		const delta = clock.getDelta();
		const elapsed = clock.getElapsedTime();
		const enemies = this.getEnemies();
		const towers = this.getTowers();

		// console.log(random(20));

		this.spawnEnemies(delta, elapsed);

		for (const object of this.updatables) {
			object.tick(delta);
		}

		if ((elapsed % 3) + delta >= 3) {
			for (const tower of towers) {
				for (const enemy of enemies) {
					const distance = tower.position.distanceTo(enemy.position);
					const inRange = tower.range - distance > -10;
					console.log({
						tower: tower.towerType,
						// enemy: enemy.name + enemy.id,
						// distance,
						// range: tower.range,
						inRange,
					});
				}
			}
		}
	}

	spawnEnemies(delta: number, elapsed: number) {
		if ((elapsed % enemyInterval) + delta >= enemyInterval) {
			const enemy = enemyGen.next().value;

			if (enemy) this.add(enemy);
			console.log(this.updatables);
		}
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
