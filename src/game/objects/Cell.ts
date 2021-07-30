import { LineBasicMaterial, Vector2, Vector3 } from 'three';
import { drawLine } from '../../utils/Level';

type Bin = 0 | 1;

export class Cell {
  constructor(a: Bin, b: Bin, c: Bin, d: Bin, width: number, origin: Vector3) {
    const points = {
      a: origin,
      b: new Vector3(origin.x + width, origin.y, 0.05),
      c: new Vector3(origin.x + width, origin.y + width, 0.05),
      d: new Vector3(origin.x, origin.y + width, 0.05),
    };
    const material = new LineBasicMaterial({ color: 'green' });

    let ab = drawLine(points.a, points.b, material);
    let bc = drawLine(points.b, points.c, material);
    let cd = drawLine(points.c, points.d, material);
    let da = drawLine(points.d, points.a, material);
  }
}
