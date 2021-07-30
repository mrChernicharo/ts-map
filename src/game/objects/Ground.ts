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
import { drawLine, randomBin } from '../../utils/Level';
import { Cell } from './Cell';

export class Ground extends Mesh {
  edges;
  constructor(private width: number, private height: number) {
    super();

    this.edges = {
      top: this.height / 2,
      bottom: -this.height / 2,
      left: -this.width / 2,
      right: this.width / 2,
    };

    this.geometry = new PlaneGeometry(width, height);
    this.material = new MeshBasicMaterial({ color: '#242424', wireframe: false });

    new Mesh(this.geometry, this.material);

    this.rotation.x -= Math.PI / 2;
    console.log(this.position);
  }

  makeGrid() {
    const tileSize = 20;
    const material = new LineBasicMaterial({ color: 'green' });
    const cells = [];

    for (let j = this.edges.bottom; j < this.edges.top; j += tileSize) {
      for (let i = this.edges.left; i < this.edges.right; i += tileSize) {
        const cell = new Cell(randomBin(), tileSize, new Vector3(i, j));
        cells.push(cell);
      }
    }

    console.log(cells);
    cells.forEach(cell => this.add(cell));
  }
}
