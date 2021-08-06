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
import { Cell, INeighbors } from './Cell';

interface Spot {
  index: number;
  col: number;
  row: number;
  isWall: boolean;
  position: Vector3;
}

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
  spots: Spot[];
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

    console.log(this.spots);
    // console.log(
    //   this.cells.forEach(cell =>
    //     // console.log({ name: cell.name, row: cell.row, col: cell.col, ...cell.position })
    //   )
    // );
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
    // create cells
    this.createCells();

    // create spots
    this.createSpots();
  }

  createCells() {
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
  createSpots() {
    const spotsSet = new Set<Spot>();
    const spotsInfoSet = new Set<string>();

    this.cells.forEach((cell, index) => {
      //
      cell.children
        .filter(obj => obj.name.includes('circle'))
        .forEach(circle => {
          const [cellPos, circlePos] = [cell.position, circle.position];

          const pos = new Vector3(cellPos.x + circlePos.x, ZERO, cellPos.z + circlePos.z);

          spotsInfoSet.add([pos.x, pos.y, pos.z, (circle as any).hasWall].join(','));
        });

      if (index === this.cells.length - 1) {
        let i = 0;

        spotsInfoSet.forEach(info => {
          // preencher spots apenas com spots únicos
          const [x, y, z, isWallStr] = info.split(',');

          const spot: Spot = {
            col: cell.col,
            row: cell.row,
            index: i,
            position: new Vector3(Number(x), Number(y), Number(z)),
            isWall: isWallStr === 'true',
          };
          spotsSet.add(spot);

          i++;
        });

        this.spots = Array.from(spotsSet);
        console.log(this.spots);
      }
    });
  }
}
