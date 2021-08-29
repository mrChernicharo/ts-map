import { BufferGeometry, Line, Material, Vector3 } from 'three';
import { Enemy } from '../objects/Enemy/Enemy';
import { binCodes, binOptions, ENEMY_DEFAULTS } from './constants';

export const random = (a: number, b?: number) => {
	if (!b) {
		return Math.round(Math.random() * a) + 1;
	}

	if (b) {
		return Math.round(Math.random() * (b - a) + a);
	}
};

export const randomBin = () => {
	const len = binOptions.length - 1;
	return binOptions[Math.round(Math.random() * len)];
};

export const drawLine = (pointA: Vector3, pointB: Vector3, material: Material) => {
	const geometry = new BufferGeometry().setFromPoints([pointA, pointB]);
	return new Line(geometry, material);
};

export function* idGenerator() {
	let id = 0;
	while (true) {
		yield id;
		id++;
	}
}

export function* enemyFactory(amount = 1) {
	for (let i = 0; i < amount; i++) {
		// let enemy = new Enemy(random(20, 40));
		let enemy = new Enemy(ENEMY_DEFAULTS.speed);

		yield enemy;
	}
}

export function towerGenerator() {
	// return new Tower();
}
