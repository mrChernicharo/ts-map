import { CircleGeometry, LineBasicMaterial, Mesh, MeshToonMaterial, Vector2, Vector3 } from 'three';
import { Wall } from './Wall';
import { Bin, BinCode, drawLine, levelFinish, levelStart, cellSize, ZERO } from '../../utils/constants';
import { Spot } from './Ground';
import { Tile } from './Tile';

const points = {
  a: new Vector3(0, 2, 0),
  b: new Vector3(cellSize, 2, 0),
  c: new Vector3(cellSize, 2, cellSize),
  d: new Vector3(0, 2, cellSize),
};

export interface CellEdges {
  a: Bin;
  b: Bin;
  c: Bin;
  d: Bin;
}

export class Cell extends Mesh {
  index: number;
  binCode: BinCode;
  origin: Vector3;
  row: number;
  col: number;
  edges: CellEdges;
  spots: Spot[] = [];
  constructor(index: number, row: number, col: number, binCode: BinCode, origin: Vector3) {
    super();
    this.index = index;
    this.col = col;
    this.row = row;
    this.binCode = binCode;
    this.origin = origin;
    this.position.set(origin.x, origin.y, origin.z);

    this.drawLines();
    this.appendSpots();
    this.buildWall();

    console.log(this.spots.length);
  }

  drawLines() {
    const lineMaterial = new LineBasicMaterial({ color: 0x444400 });

    const lines = {
      ab: drawLine(points.a, points.b, lineMaterial),
      bc: drawLine(points.b, points.c, lineMaterial),
      cd: drawLine(points.c, points.d, lineMaterial),
      da: drawLine(points.d, points.a, lineMaterial),
    };

    for (let line of ['ab', 'bc', 'cd', 'da']) {
      lines[line].name = `${line}-line-${this.index}`;
      this.add(lines[line]);
    }

    // console.log(lines.ab.position);
  }

  appendSpots() {
    let [dotPoints, binItems] = this.getSpotPoints();
    console.log(dotPoints);

    Object.entries(dotPoints).forEach(([key, point], i) => {
      const hasWall = binItems[i] === '1';

      const spot: Spot = {
        index: i,
        localPos: point,
        origin: this.origin,
        isWall: hasWall,
        name: `spot-${this.index + key}`,
      };

      console.log(spot.origin);
      this.spots.push(spot);

      // WE GOT PROBLEMS IN HERE
      // // THRER ARE MISSING/MISPLACED TILES CLOSE TO THE LEFT/TOP BORDERS
      // const tilePoints = binItems.split('').filter(bin => bin === '1');

      // tilePoints.forEach((element, i, arr) => {
      //   console.log('makeTile', binItems, arr.length);

      // });

      this.appendTile(this.origin, point);
    });
  }

  buildWall() {
    const wall = new Wall(this.binCode);
    wall.name = `${this.index}-Wall`;

    this.add(wall);
  }

  appendTile(origin: Vector3, localPos: Vector3) {
    const { x, y, z } = localPos;
    const tile = new Tile();
    tile.position.set(x, y + 24, z);
    this.add(tile);
  }

  getSpotPoints(): [{ [key: string]: Vector3 }, string] {
    let dotPoints: { [key: string]: Vector3 };
    let binItems: string;
    if (this.row === 0 && this.col === 0) {
      dotPoints = { ...points };
      binItems = this.binCode;
      //
    } else if (this.row === 0) {
      dotPoints = { b: points.b, c: points.c };
      binItems = this.binCode.substr(1, 2);
      //
    } else if ((this.row > 0, this.col === 0)) {
      dotPoints = { c: points.c, d: points.d };
      binItems = this.binCode.substr(2, 2);
      //
    } else {
      dotPoints = { c: points.c };
      binItems = this.binCode.substr(2, 1);
    }

    return [dotPoints, binItems];
  }

  appendCircles() {
    this.spots.forEach(spot => {
      const color = spot.isWall ? 0x000000 : 0xffffff;

      const circleGeomety = new CircleGeometry(3);
      const circleMaterial = new MeshToonMaterial({ color });

      const circle = new Mesh(circleGeomety, circleMaterial);
      circle.name = `circle-${this.index}`;

      circle.position.set(spot.localPos.x, spot.localPos.y + 1, spot.localPos.z);
      circle.rotateX(-Math.PI / 2);
      this.add(circle);
    });
  }
}
