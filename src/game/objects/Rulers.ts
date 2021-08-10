import { FontLoader, LineBasicMaterial, Mesh, MeshBasicMaterial, TextGeometry, Vector3 } from 'three';
import { drawLine, GROUND_WIDTH, GROUND_DEPTH, cellSize } from '../utils/constants';

const bottomBorder = GROUND_DEPTH / 2;

const points = {
  X1: new Vector3(-50, 0, bottomBorder + 20),
  X2: new Vector3(50, 0, bottomBorder + 20),
  y1: new Vector3(0, 0, bottomBorder + 20),
  y2: new Vector3(0, 50, bottomBorder + 20),
  z1: new Vector3(0, 0, bottomBorder + 20),
  z2: new Vector3(0, 0, bottomBorder + 70),
};
export class Rulers extends Mesh {
  constructor() {
    super();

    const material = color => new LineBasicMaterial({ color: color });

    const lines = {
      x: drawLine(points.X1, points.X2, material('green')),
      y: drawLine(points.y1, points.y2, material('blue')),
      z: drawLine(points.z1, points.z2, material('red')),
    };

    for (let line of Object.keys(lines)) {
      this.add(lines[line]);
    }

    this.position.set(GROUND_WIDTH / 2, 0, 0);
    this.addLetters();
  }

  addLetters() {
    const loader = new FontLoader();
    let fontMesh: Mesh;

    loader.load('assets/fonts/helvetiker_regular.typeface.json', font => {
      const params = {
        font: font,
        size: 10,
        height: 5,
        curveSegments: 12,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 5,
      };

      const material = color => new MeshBasicMaterial({ color });

      const xGeometry = new TextGeometry('X', params);
      fontMesh = new Mesh(xGeometry, material(0x00ff00));
      let [x, y, z] = [cellSize, 0, GROUND_DEPTH / 2 + cellSize * 0.5];
      fontMesh.position.set(x, y, z);
      this.add(fontMesh);

      const yGeometry = new TextGeometry('Y', params);
      fontMesh = new Mesh(yGeometry, material(0x0000ff));
      [x, y, z] = [0, cellSize, GROUND_DEPTH / 2 + cellSize * 0.5];
      fontMesh.position.set(x, y, z);
      this.add(fontMesh);

      const zGeometry = new TextGeometry('z', params);
      fontMesh = new Mesh(zGeometry, material(0xff0000));
      [x, y, z] = [0, 0, GROUND_DEPTH / 2 + cellSize * 1.5];
      fontMesh.position.set(x, y, z);
      this.add(fontMesh);
    });
  }
}
