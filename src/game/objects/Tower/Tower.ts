import EventEmitter from 'events';
import { CircleGeometry, CylinderGeometry, Mesh, MeshToonMaterial, Vector3 } from 'three';
import { Tile } from '../../map/Tile/Tile';
import { cellSize, MISSILE_FIRED } from '../../utils/constants';
import { random } from '../../utils/functions';
import { towerModels } from '../../utils/towers';
import { Enemy } from '../Enemy/Enemy';
import { Missile } from '../Missile/Missile';

export type TowerType = 'machineGun' | 'shotgun' | 'rifle';

// let stopLoggin = false;
export class Tower extends Mesh {
	tile: Tile;
	towerType: TowerType;
	range: number;
	fireRate: number; // shots per minute
	cooldownTime: number; // cooldown time until next shot
	damage: number;
	selected: boolean;
	enemiesinRange: [] = [];
	emitter: EventEmitter;
	height: number;
	constructor(pos: Vector3, tile: Tile, towerType: TowerType) {
		super();
		this.position.set(pos.x, pos.y, pos.z);
		this.tile = tile;
		this.towerType = towerType;
		this._init();
	}

	_init() {
		this.material = new MeshToonMaterial({ color: towerModels[this.towerType].color });
		this.geometry = new CylinderGeometry(
			towerModels[this.towerType].topRadius,
			towerModels[this.towerType].bottomRadius,
			towerModels[this.towerType].height,
			20
		);
		this.name = 'Tower';
		this.selected = false;
		this.height = towerModels[this.towerType].height;
		this.range = towerModels[this.towerType].range;
		this.damage = towerModels[this.towerType].damage;
		this.fireRate = towerModels[this.towerType].fireRate;
		this.cooldownTime = 1;

		this.emitter = new EventEmitter();

		new Mesh(this.geometry, this.material);

		this._correctPosition();

		this._createTowerRangeCircle();

		// console.log(this);
	}

	tick(delta) {
		if (this.cooldownTime >= 0) {
			this.cooldownTime -= delta;
		}
		// else if (this.cooldownTime < 0 && !stopLoggin) {
		// 	// console.log('ready to shoot');
		// 	stopLoggin = true;
		// }
	}

	attack(enemy: Enemy) {
		// console.log(enemy);

		this.cooldownTime = 60 / towerModels[this.towerType].fireRate;
		// stopLoggin = false;

		const missile = new Missile(this, enemy);

		return missile;

		// console.log(`attack!!! ${this.towerType + ':' + this.id} -> ${enemy.id + ':' + enemy.hp}`);
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
			color: towerModels[this.towerType].rangeRadiusColor,
			opacity: 0.3,
			transparent: true,
		});
		const geometry = new CircleGeometry(this.range, 20);

		const rangeMesh = new Mesh(geometry, material);
		rangeMesh.name = 'towerRange';
		rangeMesh.position.y = -40 + Math.random();
		rangeMesh.rotateX(-Math.PI / 2);

		this.add(rangeMesh);
	}

	_correctPosition() {
		let { x, y, z } = this.position;
		let offY = 42;

		if (this.towerType === 'shotgun') {
			offY -= 6;
		}

		if (this.tile.buildPoint === 'a') {
			this.position.set(x, y + offY, z);
		}
		if (this.tile.buildPoint === 'b') {
			this.position.set(x + cellSize, y + offY, z);
		}
		if (this.tile.buildPoint === 'c') {
			this.position.set(x + cellSize, y + offY, z + cellSize);
		}
		if (this.tile.buildPoint === 'd') {
			this.position.set(x, y + offY, z + cellSize);
		}
		if (this.tile.buildPoint === 'center') {
			this.position.set(x + cellSize / 2, y + offY, z + cellSize / 2);
		}
	}
}
