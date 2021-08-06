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
} from '../../utils/constants';
import { Cell, INeighbors } from './Cell';

interface IPseudoCell {
  index: number;
  a: Bin;
  b: Bin;
  c: Bin;
  d: Bin;
  col: number;
  row: number;
}

const idMaker = idGenerator();

export class Ground extends Mesh {
  cols: number;
  rows: number;
  pseudoCells: IPseudoCell[];
  cells: Cell[] = [];
  constructor() {
    super();

    this.cols = GROUND_WIDTH / tileSize;
    this.rows = GROUND_DEPTH / tileSize;

    this.pseudoCells = [];

    this.geometry = new BoxGeometry(GROUND_WIDTH, 4, GROUND_DEPTH);
    this.material = new MeshBasicMaterial({ color: '#242424', wireframe: false });
    this.name = 'Ground';

    this.fillPseudoCellsArr();
    this.createGrid();

    console.log(
      this.cells.forEach(cell =>
        // console.log(cell)
        console.log({ name: cell.name, row: cell.row, col: cell.col, ...cell.position })
      )
    );
  }

  fillPseudoCellsArr() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        let edges: { a: Bin; b: Bin; c: Bin; d: Bin };
        const index = idMaker.next().value as number;

        let prev = this.pseudoCells[index - 1];
        let top = this.pseudoCells[index - this.cols];

        if (r === 0 && c === 0) {
          edges = { a: randomBin(), b: randomBin(), c: randomBin(), d: randomBin() };
        } else if (r === 0) {
          edges = { a: prev.b, b: randomBin(), c: randomBin(), d: prev.c };
        } else if (r > 0 && c === 0) {
          edges = { a: top.d, b: top.c, c: randomBin(), d: randomBin() };
        } else {
          edges = { a: top.d, b: top.c, c: randomBin(), d: prev.c };
        }

        this.pseudoCells.push({ index, col: c, row: r, ...edges });
      }
    }
  }

  createGrid() {
    this.pseudoCells.forEach(item => {
      const binCode = (item.a + item.b + item.c + item.d) as BinCode;
      const originX = item.col * tileSize - GROUND_WIDTH / 2;
      const originY = item.row * tileSize - GROUND_DEPTH / 2;

      const origin = new Vector3(originX, 0, originY);

      const cell = new Cell(item.index, item.row, item.col, binCode, origin);
      cell.name = `cell-${item.index}`;

      this.cells.push(cell);
    });
    this.cells.forEach(cell => this.add(cell));
  }
}
