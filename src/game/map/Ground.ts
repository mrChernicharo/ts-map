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
  BoxGeometry,
} from 'three';
import {
  drawLine,
  tileSize,
  GROUND_DEPTH,
  GROUND_WIDTH,
  randomBin,
  Bin,
  idGenerator,
  BinCode,
  ZERO,
} from '../../utils/constants';
import { Cell } from './Cell';

const points = {
  a: new Vector3(0, 2, 0),
  b: new Vector3(tileSize, 2, 0),
  c: new Vector3(tileSize, 2, tileSize),
  d: new Vector3(0, 2, tileSize),
};

export interface Spot {
  index: number;
  isWall: boolean;
  pos: Vector3;
  hl: number; // horizontal line
  vl: number; // vertical line
  name: string;
}

const idMaker = idGenerator();

export class Ground extends Mesh {
  cols: number;
  rows: number;
  cells: Cell[] = [];
  spots: Spot[] = [];
  constructor() {
    super();

    this.cols = GROUND_WIDTH / tileSize;
    this.rows = GROUND_DEPTH / tileSize;

    this.geometry = new BoxGeometry(GROUND_WIDTH, 4, GROUND_DEPTH);
    this.material = new MeshBasicMaterial({ color: '#242424', wireframe: false });
    this.name = 'Ground';

    this.createGrid();
    this.getSpots();

    console.log(this.spots);
  }

  createGrid() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        let edges: { a: Bin; b: Bin; c: Bin; d: Bin };
        let points = {};

        const index = idMaker.next().value as number;

        let prev = this.cells[index - 1];
        let top = this.cells[index - this.cols];

        if (r === 0 && c === 0) {
          edges = { a: randomBin(), b: randomBin(), c: randomBin(), d: randomBin() };
        } else if (r === 0) {
          edges = { a: prev.edges.b, b: randomBin(), c: randomBin(), d: prev.edges.c };
        } else if (r > 0 && c === 0) {
          edges = { a: top.edges.d, b: top.edges.c, c: randomBin(), d: randomBin() };
        } else {
          edges = { a: top.edges.d, b: top.edges.c, c: randomBin(), d: prev.edges.c };
        }

        this.createCell(index, edges, r, c);
      }
    }
  }

  createCell(index: number, edges, r: number, c: number) {
    const binCode = (edges.a + edges.b + edges.c + edges.d) as BinCode;
    const originX = c * tileSize - GROUND_WIDTH / 2;
    const originY = r * tileSize - GROUND_DEPTH / 2;

    const origin = new Vector3(originX, 0, originY);

    const cell = new Cell(index, r, c, binCode, origin);
    cell.edges = edges;
    cell.name = `cell-${index}`;

    this.cells.push(cell);
    this.add(cell);
  }

  getSpots() {
    return this.cells
      .map(cell => cell.children.filter(child => child.name.includes('circle')))
      .flat()
      .forEach((mesh, i) => {
        const spot: Spot = {
          index: i,
          pos: mesh.position,
          isWall: (mesh as any).hasWall,
          hl: Math.floor(i / (this.cols + 1)),
          vl: i % (this.cols + 1),
          name: mesh.name,
        };

        this.spots.push(spot);
      });
  }
}
