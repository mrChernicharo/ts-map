import {
	BoxGeometry,
	Clock,
	Color,
	ConeGeometry,
	CylinderGeometry,
	Group,
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

const wheelPositions = (size: number) => ({
	a: { x: -size, y: -size },
	b: { x: size, y: -size },
	c: { x: size, y: size },
	d: { x: -size, y: size },
});

const colors = {
	normal: 0xff9d00,
	takingDamage: { shotgun: 0xff0000, machineGun: 0xff6900, rifle: 0x34ff98 },
};

export class Enemy extends Group {
	speed: number;
	path: Vector3[];
	nextPos: Vector3;
	velocity: Vector3;
	nxPathIdx = 1; // nextPathIndex
	state: EnemyState;
	hp: number;
	strictnessToPath = random(1, 16);
	group: Group;
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

		this._assemblyGeometry();

		this.name = `Enemy-${this.id}`;
		this.hp = 160;
		// this.clock = new Clock();

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

	_assemblyGeometry() {
		new Group();

		const [x, y, z] = Object.values(this.path[0].clone());
		this.position.set(x, y + 4, z);

		const material = new MeshToonMaterial({ color: colors.normal });
		const geometry = new BoxGeometry(8, 4, 12);
		const core = new Mesh(geometry, material);
		core.name = 'Enemy-core';

		const cabinGeo = new BoxGeometry(6, 2, 8);
		const cabin = new Mesh(cabinGeo, material);
		cabin.name = 'Enemy-cabin';
		cabin.translateY(3);
		cabin.translateZ(-1.5);

		const wheelCoords = wheelPositions(5);
		Object.values(wheelCoords).forEach(coors => {
			const wheelMat = new MeshToonMaterial({ color: 0x343434 });
			const wheelGeo = new CylinderGeometry(4, 4, 2);
			const wheel = new Mesh(wheelGeo, wheelMat);
			wheel.rotateX(Math.PI / 2);
			wheel.rotateZ(Math.PI / 2);
			wheel.name = 'Enemy-wheel';
			this.add(wheel);
			wheel.position.set(coors.x, 0, coors.y);
		});
		// wheel.position.set(x, y, z);
		// wheel.position.set()

		this.add(core);
		this.add(cabin);

		// const;
	}

	setState(str) {}
	changeColor(color: number) {
		console.log();
		const core = this.children.find(c => c.name === 'core');
		// (core as any).material = new MeshToonMaterial({ color });
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
			let next = new Vector3(nextClone.x, nextClone.y + 4, nextClone.z);
			this.velocity = pos.clone().sub(next).normalize();
			this.lookAt(next);

			const wheels = this.children.filter(c => c.name === 'wheel');
			wheels.forEach(w => w.rotateY(-0.1));

			this.position.sub(this.velocity.multiplyScalar(delta * this.speed));

			// cheguei no alvo ?
			if (this.position.distanceTo(next) < this.strictnessToPath) {
				this.nxPathIdx += 1;
				this.nextPos = this.path[this.nxPathIdx];
			}
		} else {
			// fim do caminho
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
