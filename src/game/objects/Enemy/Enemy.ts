import {
	Clock,
	Color,
	ConeGeometry,
	Mesh,
	MeshPhongMaterial,
	MeshToonMaterial,
	Object3D,
	Vector3,
} from 'three';
import { PathNode } from '../../helpers/aStarPathfinder';
import { Ground } from '../../map/Land/Ground';
import { levelStart, pathFindingDelay, cellSize } from '../../utils/constants';
import { enemyGenerator, random } from '../../utils/functions';
import { Tower } from '../Tower/Tower';

export type EnemyState = 'idle' | 'hovered' | 'selected';
const enemyGen = enemyGenerator();

const colors = {
	normal: 0xff9d00,
	takingDamage: { shotgun: 0xff0000, machineGun: 0xff6900, rifle: 0x34ff98 },
};

export class Enemy extends Mesh {
	speed: number;
	path: Vector3[];
	nextPos: Vector3;
	velocity: Vector3;
	nxPathIdx = 1; // nextPathIndex
	state: EnemyState;
	hp: number;
	strictnessToPath = random(1, 24);
	// clock: Clock;
	timeUnhurt = 0;
	currColor = colors.normal;
	constructor(speed: number) {
		super();

		this.speed = speed;

		this._init();
	}

	async _init() {
		this.path = await this._getPathNodes();

		this.material = new MeshToonMaterial({ color: colors.normal });
		this.geometry = new ConeGeometry(8, 20, 16);
		this.name = `Enemy-${this.id}`;
		this.hp = 160;
		// this.clock = new Clock();

		new Mesh(this.geometry, this.material);

		const [x, y, z] = Object.values(this.path[0].clone());
		this.position.set(x, y + 10, z);

		this.nextPos = this.path[this.nxPathIdx];

		// this.clock.start();
	}

	async _getPathNodes(): Promise<Vector3[]> {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				const ground = this.parent.children.find(item => item.name === 'Ground') as Ground;
				const path = ground.path.map((node: PathNode) => node.pos);

				if (path.length) {
					const [foreLastPos, lastPos] = [path[path.length - 2], path[path.length - 1]];

					const diff = lastPos.clone().sub(foreLastPos.clone());
					const extraPos = lastPos.clone().add(diff.clone());

					path.push(extraPos);

					// console.log({ path, foreLastPos, lastPos, diff, extraPos });

					resolve(path);
				} else {
					reject("couldn't get path nodes in time!");
				}
			}, 0);
			// }, 1000);
			// }, pathFindingDelay);
		});
	}

	setState(str) {}
	changeColor(color: number) {
		this.material = new MeshToonMaterial({ color });
	}

	takeDamage(damage: number, tower: Tower) {
		// console.log(this.clock.getElapsedTime());
		// console.log({ m: 'HIT!!!', time: this.timeUnhurt });

		this.hp -= damage;
		this.timeUnhurt = 0;

		this.changeColor(colors.takingDamage[tower.towerType]);
	}
	die() {
		this.hp -= 100;
	}

	isAlive() {
		return this.hp > 0;
	}

	move(delta: number) {
		let pos = this.position.clone();
		let nextClone = this.nextPos?.clone();

		if (nextClone) {
			let next = new Vector3(nextClone.x, nextClone.y + 12, nextClone.z);
			this.velocity = pos.clone().sub(next).normalize();

			this.position.sub(this.velocity.multiplyScalar(delta * this.speed));

			// cheguei no alvo ?
			if (this.position.distanceTo(next) < this.strictnessToPath) {
				this.nxPathIdx += 1;
				this.nextPos = this.path[this.nxPathIdx];
			}
		} else {
			this.die();
		}
	}

	getFuturePosition(time) {}

	tick(delta: number) {
		this.move(delta);

		this.timeUnhurt += delta;

		if (this.timeUnhurt > 0.1) {
			this.changeColor(colors.normal);
		}
	}
}
