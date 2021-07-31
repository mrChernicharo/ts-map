import { LineBasicMaterial, Mesh, Vector3 } from 'three';
import { drawLine, GROUND_WIDTH, GROUND_DEPTH } from '../../utils/constants';

export class Rulers extends Mesh {
  constructor() {
    super();

    const bottomBorder = GROUND_DEPTH / 2;
    const material = color => new LineBasicMaterial({ color: color });

    const points = {
      X1: new Vector3(-50, 0, bottomBorder + 20),
      X2: new Vector3(50, 0, bottomBorder + 20),
      y1: new Vector3(0, 0, bottomBorder + 20),
      y2: new Vector3(0, 50, bottomBorder + 20),
      z1: new Vector3(0, 0, bottomBorder + 20),
      z2: new Vector3(0, 0, bottomBorder + 70),
    };

    const lines = {
      x: drawLine(points.X1, points.X2, material('green')),
      y: drawLine(points.y1, points.y2, material('blue')),
      z: drawLine(points.z1, points.z2, material('red')),
    };

    for (let line of Object.keys(lines)) {
      this.add(lines[line]);
    }

    this.position.set(GROUND_WIDTH / 2, 0, 0);
  }
}
