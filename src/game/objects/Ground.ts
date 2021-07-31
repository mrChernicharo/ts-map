import {
  Line,
  MathUtils,
  Mesh,
  MeshBasicMaterial,
  LineBasicMaterial,
  PlaneGeometry,
  Vector3,
  BufferGeometry,
  Material,
} from 'three';
import { drawLine, tileSize, GROUND_DEPTH, GROUND_WIDTH, randomBin } from '../../utils/constants';
import { Cell, INeighbors } from './Cell';
import { Wall } from './Wall';

export class Ground extends Mesh {
  edges;
  width;
  depth;
  constructor() {
    super();
    this.width = GROUND_WIDTH;
    this.depth = GROUND_DEPTH;

    this.edges = {
      top: this.depth / 2,
      bottom: -this.depth / 2,
      left: -this.width / 2,
      right: this.width / 2,
    };

    this.geometry = new PlaneGeometry(this.width, this.depth);
    this.material = new MeshBasicMaterial({ color: '#242424', wireframe: false });

    new Mesh(this.geometry, this.material);

    this.rotation.x -= Math.PI / 2;
  }

  makeGrid() {
    const material = new LineBasicMaterial({ color: 'green' });
    const cellsArr: Cell[] = [];

    let [rows, cols] = [this.width / tileSize, this.depth / tileSize];

    for (let j = 0; j < cols; j++) {
      for (let i = 0; i < rows; i++) {
        const currIdx = j * cols + i;
        const origin = new Vector3(i * tileSize - this.width / 2, j * tileSize - this.depth / 2, 0);
        const dummyCell = new Cell(currIdx, randomBin(), tileSize, origin, {} as INeighbors);

        cellsArr.push(dummyCell);
      }
    }

    cellsArr.forEach((cell, i, arr) => {
      const neighbors: INeighbors = {
        left: i % cols === 0 ? null : cellsArr[i - 1],
        right: (i + 1) % cols === 0 ? null : cellsArr[i + 1],
        top: i - cols < 0 ? null : cellsArr[i - cols],
        bottom: i + cols + 1 > cols * rows ? null : cellsArr[i + cols],
      };

      const newCell = new Cell(i, cell.code, tileSize, cell.origin, neighbors);

      const wall = new Wall(newCell);
      newCell.add(wall);
      this.add(newCell);
    });

    console.log(this);
  }
}
