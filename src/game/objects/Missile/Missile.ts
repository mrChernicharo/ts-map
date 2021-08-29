import {
	Clock,
	Color,
	CylinderGeometry,
	Light,
	LightProbe,
	Mesh,
	MeshToonMaterial,
	PointLight,
	Quaternion,
	Vector2,
	Vector3,
} from 'three';
import { ENEMY_DEFAULTS, missileMods } from '../../utils/constants';
import { Enemy } from '../Enemy/Enemy';
import { Tower } from '../Tower/Tower';

export type ITrajectory = 'straight' | 'curved';
export type IMissileShape = 'capsule' | 'continuous' | 'cone';

let prevDist;
let diff;
let ticksToHit = 0;
export class Missile extends Mesh {
	counter = 0;
	frameCount = 0;
	travelTime = 0;
	tower: Tower;
	enemy: Enemy;
	origin: Vector3;
	velocity: Vector3;
	speed: number;
	trajectory: ITrajectory;
	shape: IMissileShape;
	hit = false;
	clock: Clock;
	constructor(tower: Tower, enemy: Enemy) {
		super();
		this.tower = tower;
		this.enemy = enemy;

		this._init();
	}
	_init() {
		this.name = 'Missile';
		this.origin = this.tower.position;
		this.clock = new Clock();
		// this.speed = 60;
		// this.speed = 120;
		this.speed = 240;
		this._setMissileFeatures(this.tower);

		this.material = new MeshToonMaterial({ color: 0xff6400 });
		this.geometry = this._setGeometry();

		this.geometry.rotateX(Math.PI / 2);

		new Mesh(this.geometry, this.material);

		let { x, y, z } = this.tower.position;
		y = y + this.tower.height / 3;

		this.position.set(x, y, z);

		this.clock.start();
	}

	_setMissileFeatures(tower: Tower) {
		let trajectory: ITrajectory = null;
		let shape: IMissileShape = null;

		switch (tower.towerType) {
			case 'machineGun':
				trajectory = 'straight';
				shape = 'capsule';
				break;
			case 'shotgun':
				trajectory = 'straight';
				shape = 'cone';
				break;
			case 'rifle':
				trajectory = 'straight';
				shape = 'capsule';
				break;
		}

		this.trajectory = trajectory;
		this.shape = shape;
	}

	_setGeometry() {
		let geometry;
		switch (this.tower.towerType) {
			case 'machineGun':
				geometry = new CylinderGeometry(1.4, 1.4, 3.6);
				break;
			case 'shotgun':
				geometry = new CylinderGeometry(2.2, 2.2, 4);
				break;
			case 'rifle':
				geometry = new CylinderGeometry(1.2, 2, 8);
				break;
		}
		return geometry;
	}

	getVelocity(counter?, dist?) {
		// const targetVec = this.position.clone().sub(this.enemy.position);

		const targetVec = this.position
			.clone()
			.sub(ticksToHit ? this.enemy.getFuturePos(ticksToHit - counter, dist) : this.enemy.position);

		const normalizedVec = targetVec.normalize();

		return normalizedVec;
	}

	hasHitTarget() {
		return this.hit;
	}

	tick(delta: number) {
		const distBulletEnemy = this.position.distanceTo(this.enemy.position);

		// if (this.counter === 4) {
		// 	// this.lookAt(this.enemy.getFuturePos(60));
		// }

		if (this.counter === 3) {
			ticksToHit = distBulletEnemy / diff + 2;
			console.log({ ticksToHit, aproxDistPerTick: diff });
		}

		if (this.counter % 2 === 0) {
			prevDist = distBulletEnemy;

			if (distBulletEnemy > 10) {
				this.lookAt(this.enemy.getFuturePos(ticksToHit, distBulletEnemy));
			}
		} else {
			diff = prevDist - distBulletEnemy;
		}

		if (this.counter === 0) {
			this.velocity = this.getVelocity(this.counter, distBulletEnemy).multiplyScalar(
				delta * this.speed
			);
		}

		this.counter++;

		this.position.sub(this.velocity);

		this.frameCount++;

		if (distBulletEnemy < 10) {
			this.hit = true;

			this.enemy.takeDamage(this.tower.damage, this.tower);

			console.log({
				count: this.counter,
				frameCount: this.frameCount,
				pos: this.enemy.position,
			});
		}
	}
}
