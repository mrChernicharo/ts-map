import { CircleGeometry, LineBasicMaterial, Mesh, MeshToonMaterial, Vector2, Vector3 } from 'three';
import { Wall } from './Wall';
import { Bin, BinCode, drawLine, levelFinish, levelStart, tileSize, ZERO } from '../../utils/constants';

const points = {
  a: new Vector3(0, 2, 0),
  b: new Vector3(tileSize, 2, 0),
  c: new Vector3(tileSize, 2, tileSize),
  d: new Vector3(0, 2, tileSize),
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
  constructor(index: number, row: number, col: number, binCode: BinCode, origin: Vector3) {
    super();
    this.index = index;
    this.col = col;
    this.row = row;
    this.binCode = binCode;
    this.origin = origin;
    this.position.set(origin.x, origin.y, origin.z);

    this.drawLines();
    this.appendEdgeCircle();
    this.buildWall();
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
  }

  appendEdgeCircle() {
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

    Object.entries(dotPoints).forEach(([key, point], i) => {
      const hasWall = binItems[i] === '1';
      const color = hasWall ? 0x000000 : 0xffffff;

      const circleGeomety = new CircleGeometry(2);
      const circleMaterial = new MeshToonMaterial({ color });

      const circle = new Mesh(circleGeomety, circleMaterial);
      circle.name = `circle-${this.index + key}`;
      circle['hasWall'] = hasWall;
      circle['origin'] = this.origin;

      circle.position.set(point.x, point.y + 1, point.z);
      circle.rotateX(-Math.PI / 2);

      this.add(circle);
    });
  }

  buildWall() {
    const wall = new Wall(this.binCode);
    wall.name = `${this.index}-Wall`;

    this.add(wall);
  }
}
