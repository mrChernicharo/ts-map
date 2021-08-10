import { CylinderGeometry, Mesh, MeshToonMaterial, Vector3 } from 'three';
import { BinCode, cellSize } from '../utils/constants';

export class Tower extends Mesh {
	pos: Vector3;
	binCode: BinCode;
	constructor(pos: Vector3, binCode: BinCode) {
		super();

		this.pos = pos;
		this.binCode = binCode;

		this._init();
	}

	_init() {
		this.material = new MeshToonMaterial({ color: 0x454545 });
		this.geometry = new CylinderGeometry(8, 10, 30, 20);

		new Mesh(this.geometry, this.material);

		let { x, y, z } = this.pos;

		// tentativa de consertar parte do bug...

		if (['1110', '1111'].includes(this.binCode)) {
			// x -= cellSize / 2;
			// z -= cellSize / 2;
		}

		if (['0111', '1101', '1110'].includes(this.binCode)) {
			// x += cellSize;
			// z += cellSize;
			// this.pos.add(offset);
		}

		if (['0111', '1101', '1110', '1110', '1111'].includes(this.binCode)) {
			// x += cellSize;
			// z += cellSize;
			// this.pos.add(offset);
			this.position.set(x, y + 42, z);
		} else {
			this.position.set(x + cellSize, y + 42, z + cellSize);
		}
	}

	tick(delta) {}
}
