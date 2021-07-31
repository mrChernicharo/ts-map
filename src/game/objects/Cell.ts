import { LineBasicMaterial, Mesh, Vector2, Vector3 } from 'three';
import { Wall } from './Wall';
import { Bin, drawLine } from '../../utils/constants';

export interface INeighbors {
  top: Cell | undefined;
  right: Cell | undefined;
  bottom: Cell | undefined;
  left: Cell | undefined;
}

export class Cell extends Mesh {
  code: Bin;
  width: number;
  origin: Vector3;
  coords: string;
  neighbors: INeighbors;
  constructor(index: number, code: Bin, width: number, origin: Vector3, neighbors: INeighbors) {
    super();
    this.code = code;
    this.width = width;
    this.origin = origin;
    this.neighbors = neighbors;

    const lineMaterial = new LineBasicMaterial({ color: 'green' });

    const points = {
      a: origin,
      b: new Vector3(origin.x + width, origin.y, 0),
      c: new Vector3(origin.x + width, origin.y + width, 0),
      d: new Vector3(origin.x, origin.y + width, 0),
    };

    const lines = {
      ab: drawLine(points.a, points.b, lineMaterial),
      bc: drawLine(points.b, points.c, lineMaterial),
      cd: drawLine(points.c, points.d, lineMaterial),
      da: drawLine(points.d, points.a, lineMaterial),
    };

    for (let line of Object.keys(lines)) {
      this.add(lines[line]);
    }
  }
}
