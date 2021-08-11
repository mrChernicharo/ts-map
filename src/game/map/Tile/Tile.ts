import { BoxGeometry, Mesh, MeshToonMaterial, Object3D } from 'three';
import { Tower } from '../../objects/Tower/Tower';
import { random, cellSize, BinCode } from '../../utils/constants';

export type TileState = 'idle' | 'hovered' | 'selected';
export type BuildPoint = 'a' | 'b' | 'c' | 'd' | 'center';
const materials = {
	idle: { color: 0xac3902, opacity: 1, transparent: true },
	hovered: { color: 0xac3902, opacity: 0.75, transparent: true },
	selected: { color: 0x32ed32, opacity: 0.5, transparent: true },
};

export class Tile extends Mesh {
	state: TileState;
	buildPoint: BuildPoint;
	tower: Tower;
	constructor(buildPoint: BuildPoint) {
		super();
		this.buildPoint = buildPoint;

		this._init();
	}
	_init() {
		this.material = new MeshToonMaterial(materials.idle);
		this.geometry = new BoxGeometry((cellSize / 2) * Math.sqrt(2), 6, (cellSize / 2) * Math.sqrt(2));

		new Mesh(this.geometry, this.material);

		this.name = 'Tile';
		this.state = 'idle';
		this.tower = null;

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

	addTower(tower: Tower) {
		console.log(tower);
		this.tower = tower;
	}
}
