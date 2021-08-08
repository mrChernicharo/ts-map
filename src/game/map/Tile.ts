import { BoxGeometry, Mesh, MeshToonMaterial, Object3D } from 'three';
import { random, cellSize } from '../../utils/constants';

export class Tile extends Mesh {
  constructor() {
    super();

    // const color = random(2) === 1 ? 0xac3902 : 0x0cdcdcd;
    const color = 0xac3902;
    this.material = new MeshToonMaterial({ color, opacity: 0.5, transparent: true });

    // this.geometry = new BoxGeometry(cellSize * Math.sqrt(2), 10, cellSize * Math.sqrt(2));
    this.geometry = new BoxGeometry((cellSize / 2) * Math.sqrt(2), 10, (cellSize / 2) * Math.sqrt(2));

    new Mesh(this.geometry, this.material);

    // this.position.set(cellSize / 2, 24, cellSize / 2);
    // this.position.set(cellSize / 2, 14, 0);
    // this.position.set(cellSize, 24, cellSize);
    this.position.set(0, 24, 0);
    this.rotateY(-Math.PI / 4);
  }
}
