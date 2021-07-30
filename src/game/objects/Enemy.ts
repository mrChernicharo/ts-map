import { Mesh, MeshToonMaterial, SphereGeometry, Vector3 } from 'three';
import { levelEnd, levelStart } from '../../utils/Level';

export class Enemy extends Mesh {
  type: string;
  hp: number;
  speed: number;

  constructor(type: string) {
    super();
    this.type = type;
    this.hp = 100;
    this.speed = 20;

    this.material = new MeshToonMaterial({ color: 'purple' });
    this.geometry = new SphereGeometry(5);

    new Mesh(this.geometry, this.material);

    this.position.set(levelStart.x, levelStart.y, levelStart.z);
  }

  tick(delta: number) {
    this.position.add(this.calculateVelocity());
  }

  calculateVelocity() {
    let x = levelEnd.x - levelStart.x;
    let y = levelEnd.y - levelStart.y;
    let z = levelEnd.z - levelStart.z;
    return new Vector3(x, y, z).normalize();
  }
}
