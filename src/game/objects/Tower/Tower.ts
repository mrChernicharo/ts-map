import EventEmitter from 'events';
import { CircleGeometry, CylinderGeometry, Mesh, MeshToonMaterial, Vector3 } from 'three';
import { Cell } from '../../map/Land/Cell';
import { Tile } from '../../map/Tile/Tile';
import { BinCode, cellSize, TOWER_CREATED } from '../../utils/constants';

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

export class Tower extends Mesh {
	pos: Vector3;
	tile: Tile;
	towerType: TowerType;
	range: number;
	fireRate: number;
	damage: number;
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
		this.range = ranges[this.towerType];
		this.emitter = new EventEmitter();

		new Mesh(this.geometry, this.material);

		this._correctPosition();

		this._createTowerRangeCircle();

		// console.log(this);
	}

	tick(delta) {}

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
