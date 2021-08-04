import { LineBasicMaterial, Mesh, Vector2, Vector3 } from 'three';
import { Wall } from './Wall';
import { Bin, BinCode, drawLine, tileSize, ZERO } from '../../utils/constants';

export interface INeighbors {
  top: Cell | undefined;
  right: Cell | undefined;
  bottom: Cell | undefined;
  left: Cell | undefined;
}

export class Cell extends Mesh {
  binCode: BinCode;
  origin: Vector3;
  coords: string;
  constructor(index: number, binCode: BinCode, origin: Vector3) {
    super();
    this.binCode = binCode;
    this.origin = origin;

    const width = tileSize;
    const lineMaterial = new LineBasicMaterial({ color: 'green' });

    const points = {
      a: new Vector3(origin.x, origin.y + 2, origin.z),
      b: new Vector3(origin.x + width, origin.y + 2, origin.z),
      c: new Vector3(origin.x + width, origin.y + 2, origin.z + width),
      d: new Vector3(origin.x, origin.y + 2, origin.z + width),
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

    // console.log(index, neighbors);
  }
}
