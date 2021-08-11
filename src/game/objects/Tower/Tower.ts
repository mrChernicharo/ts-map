import { CylinderGeometry, Mesh, MeshToonMaterial, Vector3 } from 'three';
import { Tile } from '../../map/Tile/Tile';
import { BinCode, cellSize } from '../../utils/constants';

export class Tower extends Mesh {
	pos: Vector3;
	tile: Tile;
	constructor(pos: Vector3, tile: Tile) {
		super();
		this.pos = pos;
		this.tile = tile;

		this._init();
	}

	_init() {
		this.material = new MeshToonMaterial({ color: 0x454545 });
		this.geometry = new CylinderGeometry(8, 10, 30, 20);

		new Mesh(this.geometry, this.material);

		this._correctPosition();
	}

	tick(delta) {}

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
