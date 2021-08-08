import { BoxGeometry, Mesh, MeshToonMaterial, Object3D } from 'three';
import { random, cellSize } from '../../utils/constants';

export class Tile extends Mesh {
  constructor() {
    super();

    const color = 0xac3902;
    this.material = new MeshToonMaterial({ color, opacity: 0.75, transparent: true });

    this.geometry = new BoxGeometry((cellSize / 2) * Math.sqrt(2), 10, (cellSize / 2) * Math.sqrt(2));

    new Mesh(this.geometry, this.material);

    this.name = 'Tile';
    this.position.set(0, 24, 0);
    this.rotateY(-Math.PI / 4);
  }
}
