import { Mesh, MeshToonMaterial, Shape, ExtrudeGeometry, BoxGeometry, Vector3, Vector2, Color } from 'three';
import { Bin, BinCode, levelFinish, levelStart, cellSize } from '../../utils/constants';
import { Cell } from './Cell';

export class Wall extends Mesh {
	material: MeshToonMaterial;
	binCode: BinCode;
	constructor(binCode: BinCode) {
		super();
		this.binCode = binCode;

		// this.material = new MeshToonMaterial({ color: 0x9a9a9a });
		// this.material = new MeshToonMaterial({ color: 0x983502 });
		this.material = new MeshToonMaterial({ color: 0x8f7856 });
		0xac3902;
		this.geometry = this.getGeometry();

		new Mesh(this.geometry, this.material);

		this.rotateX(Math.PI / 2);
		this.position.y += cellSize / 2 + 2;
	}

	getGeometry() {
		let wallGeometry;
		let shape = new Shape();
		let optionalShape = new Shape();
		const [side, halfSide] = [cellSize, cellSize / 2];

		const extrudeSettings = {
			steps: 2,
			depth: cellSize / 2,
			bevelEnabled: false,
			// bevelThickness: 1,
			// bevelSize: 1,
			// bevelOffset: 0,
			// bevelSegments: 1,
		};

		switch (this.binCode) {
			case '0000':
				break;
			case '1000':
				shape
					.lineTo(halfSide, 0)
					.lineTo(halfSide / 2, halfSide / 2)
					.lineTo(0, halfSide)
					.closePath();
				break;
			case '0100':
				shape.moveTo(halfSide, 0).lineTo(side, 0).lineTo(side, halfSide).closePath();
				break;
			case '0010':
				shape.moveTo(halfSide, side).lineTo(side, side).lineTo(side, halfSide).closePath();
				break;
			case '0001':
				shape.moveTo(0, side).lineTo(0, halfSide).lineTo(halfSide, side).closePath();
				break;
			case '1100':
				shape.lineTo(side, 0).lineTo(side, halfSide).lineTo(0, halfSide).closePath();
				break;
			case '0110':
				shape
					.moveTo(halfSide, 0)
					.lineTo(side, 0)
					.lineTo(side, side)
					.lineTo(halfSide, side)
					.closePath();
				break;
			case '0011':
				shape
					.moveTo(0, side)
					.lineTo(0, halfSide)
					.lineTo(side, halfSide)
					.lineTo(side, side)
					.closePath();
				break;
			case '1001':
				shape.lineTo(halfSide, 0).lineTo(halfSide, side).lineTo(0, side).closePath();
				break;
			case '1010':
				shape.lineTo(halfSide, 0).lineTo(0, halfSide).lineTo(0, 0);
				optionalShape
					.moveTo(side, side)
					.lineTo(halfSide, side)
					.lineTo(side, halfSide)
					.lineTo(side, side);
				break;
			case '0101':
				shape.moveTo(halfSide, 0).lineTo(side, 0).lineTo(side, halfSide).closePath();
				optionalShape.moveTo(0, side).lineTo(0, halfSide).lineTo(halfSide, side).closePath();
				break;
			case '0111':
				shape
					.moveTo(halfSide, 0)
					.lineTo(side, 0)
					.lineTo(side, side)
					.lineTo(0, side)
					.lineTo(0, halfSide)
					.closePath();
				break;
			case '1011':
				shape
					.lineTo(halfSide, 0)
					.lineTo(side, halfSide)
					.lineTo(side, side)
					.lineTo(0, side)
					.closePath();
				break;
			case '1101':
				shape
					.lineTo(side, 0)
					.lineTo(side, halfSide)
					.lineTo(halfSide, side)
					.lineTo(0, side)
					.closePath();
				break;
			case '1110':
				shape
					.lineTo(cellSize, 0)
					.lineTo(cellSize, cellSize)
					.lineTo(halfSide, side)
					.lineTo(0, halfSide)
					.closePath();
				break;
			case '1111':
				shape.lineTo(cellSize, 0).lineTo(cellSize, cellSize).lineTo(0, cellSize).closePath();
				break;

			default:
				break;
		}
		wallGeometry = new ExtrudeGeometry([shape, optionalShape], extrudeSettings);

		return wallGeometry;
	}
}
