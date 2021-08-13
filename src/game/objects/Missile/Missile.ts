import {
	Color,
	CylinderGeometry,
	Light,
	LightProbe,
	Mesh,
	MeshToonMaterial,
	PointLight,
	Vector3,
} from 'three';
import { Enemy } from '../Enemy/Enemy';
import { Tower } from '../Tower/Tower';

export type ITrajectory = 'straight' | 'curved';
export type IMissileShape = 'capsule' | 'continuous' | 'cone';

export class Missile extends Mesh {
	tower: Tower;
	enemy: Enemy;
	origin: Vector3;
	speed: number;
	trajectory: ITrajectory;
	shape: IMissileShape;
	constructor(tower: Tower, enemy: Enemy) {
		super();
		this.tower = tower;
		this.enemy = enemy;

		this._init();
	}
	_init() {
		this.name = 'Missile';
		this.origin = this.tower.position;
		this._setMissileFeatures(this.tower);

		this.material = new MeshToonMaterial({ color: 0xff6400 });
		this.geometry = this._setGeometry();

		new Mesh(this.geometry, this.material);
		const { x, y, z } = this.tower.position;
		this.position.set(x, y + 20, z);
		this.rotateX(Math.PI / 2);
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

	tick(delta: number) {
		// console.log(delta);
	}
}
