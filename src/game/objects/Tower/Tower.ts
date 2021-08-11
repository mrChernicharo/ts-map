import EventEmitter from 'events';
import { CircleGeometry, CylinderGeometry, Mesh, MeshToonMaterial, Vector3 } from 'three';
import { Cell } from '../../map/Land/Cell';
import { Tile } from '../../map/Tile/Tile';
import { BinCode, cellSize } from '../../utils/constants';

export type TowerType = 'A' | 'B';

export class Tower extends Mesh {
	pos: Vector3;
	tile: Tile;
	towerType: TowerType;
	range: number;
	enemiesinRange: [] = [];
	constructor(pos: Vector3, tile: Tile, towerType) {
		super();
		this.pos = pos;
		this.tile = tile;
		this.towerType = towerType;
		this.range = this._setRange();
		this._init();
	}

	_init() {
		this.material = new MeshToonMaterial({ color: 0x454545 });
		this.geometry = new CylinderGeometry(8, 10, 30, 20);
		this.name = 'Tower';

		new Mesh(this.geometry, this.material);

		this._correctPosition();

		this._createTowerRange();

		console.log(this);
	}

	tick(delta) {}

	_createTowerRange() {
		const material = new MeshToonMaterial({ color: 0x0056ed, opacity: 0.3, transparent: true });
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

	_setRange() {
		let range: number;
		switch (this.towerType) {
			case 'A':
				range = 120;
				break;
			case 'B':
				range = 60;
				break;
			default:
				range = 90;
		}

		return range;
	}
}
