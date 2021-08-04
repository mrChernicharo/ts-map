import { CircleGeometry, LineBasicMaterial, Mesh, MeshToonMaterial, Vector2, Vector3 } from 'three';
import { Wall } from './Wall';
import { Bin, BinCode, drawLine, tileSize, ZERO } from '../../utils/constants';

const points = {
  a: new Vector3(0, 2, 0),
  b: new Vector3(tileSize, 2, 0),
  c: new Vector3(tileSize, 2, tileSize),
  d: new Vector3(0, 2, tileSize),
};

export interface INeighbors {
  top: Cell | undefined;
  right: Cell | undefined;
  bottom: Cell | undefined;
  left: Cell | undefined;
}

export class Cell extends Mesh {
  index: number;
  binCode: BinCode;
  origin: Vector3;
  constructor(index: number, binCode: BinCode, origin: Vector3) {
    super();
    this.index = index;
    this.binCode = binCode;
    this.origin = origin;
    this.position.set(origin.x, origin.y, origin.z);

    this.drawLines();
    this.appendEdgeCircle();
    this.buildWall();
  }

  drawLines() {
    const lineMaterial = new LineBasicMaterial({ color: 'green' });

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
    // console.log(Object.entries(points));
    Object.entries(points).forEach(([key, point], i) => {
      const color = this.binCode.slice(i, i + 1) === '1' ? 0xff0000 : 0xffffff;

      const circleGeomety = new CircleGeometry(4);
      const circleMaterial = new MeshToonMaterial({ color });

      const circle = new Mesh(circleGeomety, circleMaterial);
      circle.name = `${key}-circle-${this.index}`;

      circle.position.set(point.x, point.y + 1, point.z);
      circle.rotateX(-Math.PI / 2);

      this.add(circle);
    });
  }

  buildWall() {
    const wall = new Wall(this.binCode);
    wall.name = `${this.index}-Wall`;
    // console.log(wall.name);

    // const equidistantPoint = points.a.distanceTo(points.c) / 2;
    // console.log(equidistantPoint);

    // wall.position.set()

    this.add(wall);
  }
}
