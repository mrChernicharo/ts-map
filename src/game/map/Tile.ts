import { BoxGeometry, Mesh, MeshToonMaterial, Object3D } from 'three';
import { random, cellSize, BinCode } from '../utils/constants';

export type TileState = 'idle' | 'hovered' | 'selected';

const materials = {
	idle: { color: 0xac3902, opacity: 1, transparent: true },
	hovered: { color: 0xac3902, opacity: 0.75, transparent: true },
	selected: { color: 0x32ed32, opacity: 0.5, transparent: true },
};

export class Tile extends Mesh {
	state: TileState;
	binCode: BinCode;
	isCentral: boolean;
	isExtra: boolean;
	constructor(binCode: BinCode, isExtra = false, isCentral = false) {
		super();

		this.binCode = binCode;
		this.isExtra = isExtra;
		this.isCentral = isCentral;

		this.material = new MeshToonMaterial(materials.idle);
		this.geometry = new BoxGeometry((cellSize / 2) * Math.sqrt(2), 6, (cellSize / 2) * Math.sqrt(2));

		new Mesh(this.geometry, this.material);

		this.name = 'Tile';
		this.state = 'idle';

		this.position.set(0, 24, 0);
		this.rotateY(-Math.PI / 4);
	}

	setState(state: TileState) {
		this.state = state;

		switch (this.state) {
			case 'idle':
				this.material = new MeshToonMaterial(materials.idle);
				break;
			case 'hovered':
				this.material = new MeshToonMaterial(materials.hovered);
				break;
			case 'selected':
				this.material = new MeshToonMaterial(materials.selected);
				break;
		}
	}
}
