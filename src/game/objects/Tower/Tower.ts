import EventEmitter from 'events';
import { CircleGeometry, CylinderGeometry, Mesh, MeshToonMaterial, Vector3 } from 'three';
import { Cell } from '../../map/Land/Cell';
import { Tile } from '../../map/Tile/Tile';
import { BinCode, cellSize, INFLICT_DAMAGE, TOWER_CREATED } from '../../utils/constants';
import { Enemy } from '../Enemy/Enemy';

export type TowerType = 'A' | 'B';

const ranges = {
	A: 100,
	B: 60,
	C: 140,
	undefined: 90,
};
const rangeCircles = {
	A: 0x0056ed,
	B: 0xcd56ed,
	C: 0x00cd62,
	undefined: 0xffffff,
};
const cooldown = {
	A: 0.8,
	B: 0.5,
	C: 2,
	undefined: 2,
};
const damages = {
	A: 40,
	B: 50,
	C: 60,
	undefined: 40,
};

let stopLoggin = false;
export class Tower extends Mesh {
	pos: Vector3;
	tile: Tile;
	towerType: TowerType;
	range: number;
	fireRate: number; // shots per minute
	cooldownTime: number; // cooldown time until next shot
	damage: number;
	selected: boolean;
	enemiesinRange: [] = [];
	emitter: EventEmitter;
	constructor(pos: Vector3, tile: Tile, towerType) {
		super();
		this.pos = pos;
		this.tile = tile;
		this.towerType = towerType;
		this._init();
	}

	_init() {
		this.material = new MeshToonMaterial({ color: 0x454545 });
		this.geometry = new CylinderGeometry(8, 10, 30, 20);
		this.name = 'Tower';
		this.selected = false;
		this.range = ranges[this.towerType];
		this.cooldownTime = 1;
		this.damage = damages[this.towerType];

		this.emitter = new EventEmitter();

		new Mesh(this.geometry, this.material);

		this._correctPosition();

		this._createTowerRangeCircle();

		// console.log(this);
	}

	tick(delta) {
		if (this.cooldownTime >= 0) {
			this.cooldownTime -= delta;
		} else if (this.cooldownTime < 0 && !stopLoggin) {
			console.log('ready to shoot');
			stopLoggin = true;
		}
	}

	attack(enemy: Enemy) {
		console.log(enemy);

		this.cooldownTime = cooldown[this.towerType];
		stopLoggin = false;

		// this.emitter.emit(INFLICT_DAMAGE, enemy);
		enemy.takeDamage(this.damage);

		console.log(`attack!!! ${this.towerType + ':' + this.id} -> ${enemy.id + ':' + enemy.hp}`);
	}

	highlight() {
		const mat = this.material as any;
		mat.opacity = 0.5;
		mat.transparent = true;

		this.selected = true;
	}

	removeHighlight() {
		const mat = this.material as any;
		mat.opacity = 1;
		mat.transparent = false;

		this.selected = false;
	}

	_createTowerRangeCircle() {
		const material = new MeshToonMaterial({
			color: rangeCircles[this.towerType],
			opacity: 0.3,
			transparent: true,
		});
		const geometry = new CircleGeometry(this.range, 20);

		const rangeMesh = new Mesh(geometry, material);
		rangeMesh.name = 'towerRange';
		rangeMesh.position.y = -39;
		rangeMesh.rotateX(-Math.PI / 2);

		this.add(rangeMesh);
	}

	_correctPosition() {
		let { x, y, z } = this.pos;

		if (this.tile.buildPoint === 'a') {
			this.position.set(x, y + 42, z);
		}
		if (this.tile.buildPoint === 'b') {
			this.position.set(x + cellSize, y + 42, z);
		}
		if (this.tile.buildPoint === 'c') {
			this.position.set(x + cellSize, y + 42, z + cellSize);
		}
		if (this.tile.buildPoint === 'd') {
			this.position.set(x, y + 42, z + cellSize);
		}
		if (this.tile.buildPoint === 'center') {
			this.position.set(x + cellSize / 2, y + 42, z + cellSize / 2);
		}
	}
}
