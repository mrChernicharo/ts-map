import { ConeGeometry, Mesh, MeshPhongMaterial, MeshToonMaterial, Object3D, Vector3 } from 'three';
import { PathNode } from '../../helpers/aStarPathfinder';
import { Ground } from '../../map/Land/Ground';
import { levelStart, pathFindingDelay, cellSize, enemyGenerator } from '../../utils/constants';

export type EnemyState = 'idle' | 'hovered' | 'selected';
const enemyGen = enemyGenerator();

export class Enemy extends Mesh {
	speed: number;
	path: Vector3[];
	nextPos: Vector3;
	velocity: Vector3;
	nxPathIdx = 1; // nextPathIndex
	state: EnemyState;
	hp: number;
	constructor(speed: number) {
		super();

		this.speed = speed;

		this._init();
	}

	async _init() {
		this.path = await this._getPathNodes();

		this.material = new MeshToonMaterial({ color: 0xff9d00 });
		this.geometry = new ConeGeometry(8, 20, 16);
		this.name = `Enemy-${this.id}`;
		this.hp = 100;

		new Mesh(this.geometry, this.material);

		const [x, y, z] = Object.values(this.path[0].clone());
		this.position.set(x, y, z);

		this.nextPos = this.path[this.nxPathIdx];
	}

	async _getPathNodes(): Promise<Vector3[]> {
		return new Promise((resolve, reject) => {
			setTimeout(() => {
				const ground = this.parent.children.find(item => item.name === 'Ground') as Ground;

				ground.path.length
					? resolve(ground.path.map((node: PathNode) => node.pos))
					: reject("couldn't get path nodes in time!");
				// }, 0);
				// }, 1000);
			}, pathFindingDelay);
		});
	}

	setState(str) {}
	changeColor(color) {}

	takeDamage(damage: number) {
		this.hp -= damage;
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

			if (this.position.distanceTo(next) < 4) {
				this.nxPathIdx += 1;
				this.nextPos = this.path[this.nxPathIdx];
			}
		}
	}

	tick(delta: number) {
		this.move(delta);
	}
}
