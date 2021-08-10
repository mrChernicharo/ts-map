import { Clock, Mesh, Quaternion, Vector3, WebGL1Renderer } from 'three';
import { Camera } from './Camera';
import { Cube } from '../objects/Cube';
import { Scene } from './Scene';
import { Ball } from '../objects/Ball';
import { towerGenerator, enemyGenerator, levelFinish, levelStart, random } from '../utils/constants';
import { Flag } from '../objects/Flag';
import { Enemy } from '../objects/Enemy';
import { EventsManager } from '../helpers/EventsManager';
import { Tower } from '../objects/Tower';

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
		console.log(this);
	}

	setUp() {
		const [startFlag, endFlag] = [new Flag(levelStart), new Flag(levelFinish)];
		this.add(startFlag);
		this.add(endFlag);

		this.eventsManager.emitter.on('createTower', pos => {
			const tower = new Tower(pos);
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

	remove() {
		// const removingEl = this.updatables.find((item) => item.uuid === id);
		// this.updatables = this.updatables.filter((item) => item.uuid === id);
		// this.scene.remove(removingEl);
		// console.log({ updatables: this.updatables, removingEl, id });
	}

	tick() {
		const delta = clock.getDelta();
		const elapsed = clock.getElapsedTime();

		// console.log(random(20));

		if ((elapsed % enemyInterval) + delta >= enemyInterval) {
			const enemy = enemyGen.next().value;

			if (enemy) this.add(enemy);
		}

		// if ((elapsed % 10) + delta >= 10) {
		//   console.log(this.updatables);
		// }

		for (const object of this.updatables) {
			object.tick(delta);
		}
	}
}

export { Loop };
