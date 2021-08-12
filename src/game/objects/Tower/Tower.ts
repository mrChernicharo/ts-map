import EventEmitter from 'events';
import { CircleGeometry, CylinderGeometry, Mesh, MeshToonMaterial, Vector3 } from 'three';
import { Cell } from '../../map/Land/Cell';
import { Tile } from '../../map/Tile/Tile';
import { BinCode, cellSize, INFLICT_DAMAGE, TOWER_CREATED } from '../../utils/constants';
import { Enemy } from '../Enemy/Enemy';

export type TowerType = 'A' | 'B' | 'C';

const models = {
	A: {
		topRadius: 8,
		bottomRadius: 9,
		height: 40,
		range: 95,
		rangeRadiusColor: 0x0056ed,
		color: 0x8a8a8a,
		fireRate: 30, // 1 shot each 2s
		damage: 10,
	},
	B: {
		topRadius: 10,
		bottomRadius: 12,
		height: 25,
		range: 80,
		rangeRadiusColor: 0xed1067,
		color: 0x454545,
		fireRate: 25,
		damage: 12,
	},
	C: {
		topRadius: 6,
		bottomRadius: 7,
		height: 50,
		range: 110,
		rangeRadiusColor: 0x00ab34,
		color: 0xdedede,
		fireRate: 20, // 1 shot each 3s
		damage: 14,
	},
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
	constructor(pos: Vector3, tile: Tile, towerType: TowerType) {
		super();
		this.pos = pos;
		this.tile = tile;
		this.towerType = towerType;
		this._init();
	}

	_init() {
		this.material = new MeshToonMaterial({ color: models[this.towerType].color });
		this.geometry = new CylinderGeometry(
			models[this.towerType].topRadius,
			models[this.towerType].bottomRadius,
			models[this.towerType].height,
			20
		);
		this.name = 'Tower';
		this.selected = false;
		this.range = models[this.towerType].range;
		this.cooldownTime = 1;
		this.damage = models[this.towerType].damage;

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

		this.cooldownTime = models[this.towerType].fireRate / 60;
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
			color: models[this.towerType].rangeRadiusColor,
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
