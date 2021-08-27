import {
	BoxGeometry,
	CircleGeometry,
	Color,
	ConeGeometry,
	CylinderGeometry,
	ExtrudeGeometry,
	Group,
	Mesh,
	MeshPhongMaterial,
	MeshToonMaterial,
	Object3D,
	Shape,
	Vector3,
} from 'three';
import { PathNode } from '../../helpers/aStarPathfinder';
import { Ground } from '../../map/Land/Ground';
import { levelStart, pathFindingDelay, cellSize } from '../../utils/constants';
import { enemyFactory, random } from '../../utils/functions';
import { Tower } from '../Tower/Tower';
import { enemyModels } from '../../utils/enemies';

export type IEnemyType = 'jeep' | 'tank';
const enemyGen = enemyFactory();

const colors = {
	normal: 0xff9d00,
	takingDamage: { shotgun: 0xff0000, machineGun: 0xff6900, rifle: 0x34edab },
};

export class Enemy extends Group {
	speed: number;
	path: Vector3[];
	nextPos: Vector3;
	velocity: Vector3;
	nxPathIdx = 1; // nextPathIndex
	hp: number;
	strictnessToPath = random(1, 12);
	group: Group;
	timeUnhurt = 0;
	currColor = colors.normal;
	enemyType: IEnemyType;
	hasCompletedPath = false;
	constructor(speed: number) {
		super();

		this.speed = speed;

		this._init();
	}

	async _init() {
		this.path = await this._getPathNodes();

		this._assemblyGeometry();

		this.name = `Enemy-${this.id}`;
		this.hp = 100;

		this.nextPos = this.path[this.nxPathIdx];
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

	_assemblyGeometry() {
		new Group();

		enemyModels.jeep.geometryFn(this, colors.normal);
	}

	changeColor(color: number) {
		const enemyBody = this.children.filter(c => ['Enemy-core', 'Enemy-cabin'].includes(c.name));

		enemyBody.forEach(piece => ((piece as any).material = new MeshToonMaterial({ color })));
	}

	takeDamage(damage: number, tower: Tower) {
		this.hp -= damage;
		this.timeUnhurt = 0;

		this.changeColor(colors.takingDamage[tower.towerType]);
	}

	isAlive() {
		return this.hp > 0;
	}

	die() {
		this.hp = 0;
	}

	move(delta: number) {
		let pos = this.position.clone();
		let nextClone = this.nextPos?.clone();

		if (nextClone) {
			let next = new Vector3(nextClone.x, nextClone.y + 4, nextClone.z);
			this.velocity = pos.clone().sub(next).normalize();
			this.lookAt(next);

			const wheels = this.children.filter(c => ['Enemy-wheel', 'Enemy-wheel-center'].includes(c.name));
			wheels.forEach(w => w.rotateY(-0.1));

			this.position.sub(this.velocity.multiplyScalar(delta * this.speed));

			// cheguei no alvo ?
			if (this.position.distanceTo(next) < this.strictnessToPath) {
				this.nxPathIdx += 1;
				this.nextPos = this.path[this.nxPathIdx];
			}
		} else {
			// fim do caminho
			// this.hasCompletedPath = true;
			// this.die();
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
