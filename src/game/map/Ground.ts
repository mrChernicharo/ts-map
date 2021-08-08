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
  LineDashedMaterial,
} from 'three';
import { AStarPathfinder, PathNode } from '../../utils/aStarPathfinder';
// import { AStarPathfinder } from '../../utils/AStarPathfinder';
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
  levelStart,
  levelFinish,
  cellPoints,
} from '../../utils/constants';
import { PathSpot } from './PathSpot';
import { Cell } from './Cell';

export interface Spot {
  index: number;
  isWall: boolean;
  origin: Vector3;
  localPos: Vector3;
  hl: number; // horizontal line
  vl: number; // vertical line
  name: string;
}

type Edges = {
  a: Bin;
  b: Bin;
  c: Bin;
  d: Bin;
};

const idMaker = idGenerator();

export class Ground extends Mesh {
  cols: number;
  rows: number;
  cells: Cell[] = [];
  spots: Spot[] = [];
  path: PathNode[] = [];
  pathfinder: AStarPathfinder;
  constructor() {
    super();

    this.cols = GROUND_WIDTH / tileSize;
    this.rows = GROUND_DEPTH / tileSize;

    this.geometry = new BoxGeometry(GROUND_WIDTH, 4, GROUND_DEPTH);
    this.material = new MeshBasicMaterial({ color: '#242424', wireframe: false });
    this.name = 'Ground';

    this.createGrid();
    this.getSpots();
    this.initPathFinder();
  }

  createGrid() {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        let edges: { a: Bin; b: Bin; c: Bin; d: Bin };

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

  createCell(index: number, edges: Edges, r: number, c: number) {
    const originX = c * tileSize - GROUND_WIDTH / 2;
    const originY = r * tileSize - GROUND_DEPTH / 2;

    const origin = new Vector3(originX, 0, originY);

    const binCode = this.enhanceBinCode(origin, edges);

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
        //
        const spot: Spot = {
          index: i,
          localPos: mesh.position,
          origin: (mesh as any).origin,
          isWall: (mesh as any).hasWall,
          name: mesh.name,
          hl: Math.floor(i / (this.cols + 1)),
          vl: i % (this.cols + 1),
        };

        this.spots.push(spot);
      });
  }

  enhanceBinCode(origin: Vector3, edges: Edges) {
    const dists = {
      a: origin.clone().add(cellPoints.a),
      b: origin.clone().add(cellPoints.b),
      c: origin.clone().add(cellPoints.c),
      d: origin.clone().add(cellPoints.d),
    };

    // prevents start/finish from being locked by walls:
    // forces bin '0' if edge is too close from start/finish
    Object.entries(dists).forEach(([key, distance]) => {
      if (distance.distanceTo(levelStart) < tileSize * 2 || distance.distanceTo(levelFinish) < tileSize * 2) {
        edges[key] = '0';
      }
    });

    return (edges.a + edges.b + edges.c + edges.d) as BinCode;
  }

  initPathFinder() {
    this.pathfinder = new AStarPathfinder(this.spots, levelStart, levelFinish);

    const interval = setInterval(() => {
      //
      if (this.pathfinder.step() !== 0) {
        clearInterval(interval);

        this.path = this.pathfinder.getPathArray();
        this.createPathLine();

        // emit event notifying path completion
      }

      this.drawPathSpots();
    });
  }

  createPathLine() {
    const pathMaterial = new LineDashedMaterial({ dashSize: 3, color: 0xff9d00 });
    const pathGeometry = [];

    this.path.forEach(n => {
      const pathLine = drawLine(n?.previous?.pos || levelStart, n.pos, pathMaterial);
      pathLine.position.y += 10;

      this.add(pathLine);
    });
  }

  drawPathSpots() {
    this.pathfinder.closedSet.forEach(node => this.add(new PathSpot(node.pos, 'closed')));
    this.pathfinder.openSet.forEach(node => this.add(new PathSpot(node.pos, 'open')));
    this.add(new PathSpot(this.pathfinder.lastCheckedNode.pos, 'current'));
  }
}
