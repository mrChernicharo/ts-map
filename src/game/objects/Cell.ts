import { LineBasicMaterial, Mesh, Vector2, Vector3 } from 'three';
import { drawLine } from '../../utils/Level';

//prettier-ignore
type BinCode = 
 '1000'| '0100' | '0010' | '0001' 
|'1100'| '0110' | '0011' | '1001'
|'0101'| '1010' | '1111' | '0000'
|'1011'| '1101' | '1110' | '0111'

export class Cell extends Mesh {
  constructor(code: BinCode, width: number, origin: Vector3) {
    super();

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
