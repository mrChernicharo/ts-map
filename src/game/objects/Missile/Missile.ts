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
	Vector3,
} from 'three';
import { missileMods } from '../../utils/constants';
import { Enemy } from '../Enemy/Enemy';
import { Tower } from '../Tower/Tower';

export type ITrajectory = 'straight' | 'curved';
export type IMissileShape = 'capsule' | 'continuous' | 'cone';

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
		this.speed = 150;
		this._setMissileFeatures(this.tower);

		this.material = new MeshToonMaterial({ color: 0xff6400 });
		this.geometry = this._setGeometry();

		new Mesh(this.geometry, this.material);
		const { x, y, z } = this.tower.position;
		this.position.set(x, y + this.tower.height / 3, z);
		// this.rotateX(Math.PI / 2);

		// const quat = this.quaternion.setFromUnitVectors(this.position, this.getVelocity());
		const quat = this.quaternion.setFromUnitVectors(this.position, this.enemy.position);
		// const quat = this.quaternion.setFromUnitVectors(this.enemy.position, this.position);
		// this.quaternion.rotateTowards(quat, missileMods.quatFactor);
		this.quaternion.slerp(quat, missileMods.quatFactor);

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
				geometry = new CylinderGeometry(1, 1, 3);
				break;
			case 'shotgun':
				geometry = new CylinderGeometry(2, 2, 4);
				break;
			case 'rifle':
				geometry = new CylinderGeometry(1, 2, 7);
				break;
		}
		return geometry;
	}

	getVelocity() {
		// console.log(this.enemy.position);

		const targetVec = this.position.clone().sub(this.enemy.position);
		const normalizedVec = targetVec.normalize();

		return normalizedVec;
	}

	hasHitTarget() {
		return this.hit;
	}

	getEnemyFuturePosition(time) {}

	tick(delta: number) {
		const dist = this.position.distanceTo(this.enemy.position);

		this.position.sub(this.getVelocity().multiplyScalar(delta * this.speed));
		this.travelTime += delta;

		if (dist < 4) {
			while (this.counter < 1) {
				console.log('hit !');
				this.hit = true;

				this.enemy.takeDamage(this.tower.damage, this.tower);

				// console.log({
				// 	cl: this.clock.elapsedTime,
				// 	enemy: this.enemy,
				// 	frameCount: this.frameCount,
				// 	travelTime: this.travelTime,
				// });
				this.counter++;
			}
		}
	}
}
