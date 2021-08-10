import { CylinderGeometry, Mesh, MeshToonMaterial, Vector3 } from 'three';
import { cellSize } from '../utils/constants';

export class Tower extends Mesh {
	pos: Vector3;
	constructor(pos: Vector3) {
		super();
		this.pos = pos;
		this._init();
	}

	_init() {
		this.material = new MeshToonMaterial({ color: 0x454545 });
		this.geometry = new CylinderGeometry(8, 10, 30, 20);

		new Mesh(this.geometry, this.material);

		const { x, y, z } = this.pos;
		this.position.set(x + cellSize, y + 42, z + cellSize);
	}

	tick(delta) {}
}
