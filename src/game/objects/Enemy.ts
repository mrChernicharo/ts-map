import { ConeGeometry, Mesh, MeshPhongMaterial } from 'three';
import { levelStart } from '../../utils/constants';

export class Enemy extends Mesh {
  constructor() {
    super();

    this.material = new MeshPhongMaterial({ color: 0xff9d00 });
    this.geometry = new ConeGeometry(8, 20);

    new Mesh(this.geometry, this.material);

    const [x, y, z] = Object.values(levelStart);
    this.position.set(x, y + 12, z);
  }

  tick() {}
}
