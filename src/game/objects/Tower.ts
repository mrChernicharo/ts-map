import { CylinderGeometry, Mesh, MeshToonMaterial, Vector3 } from 'three';
import { Tile } from '../map/Tile';
import { BinCode, cellSize } from '../utils/constants';

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

		let { x, y, z } = this.pos;

		// tentativa de consertar parte do bug...

		if (this.tile.isExtra) {
			x -= cellSize / 2;
			z -= cellSize / 2;
		}
		this.position.set(x + cellSize, y + 42, z + cellSize);
	}

	tick(delta) {}
}
