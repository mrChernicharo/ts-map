import { Mesh, MeshToonMaterial, SphereGeometry, Vector3 } from 'three';
import { levelEnd, levelStart } from '../../utils/constants';

export class Enemy extends Mesh {
  type: string;
  hp: number;
  speed: number;
  initialPos;
  targetPos;
  constructor(type: string) {
    super();
    this.type = type;
    this.hp = 100;
    this.speed = 20;

    this.material = new MeshToonMaterial({ color: 'purple' });
    this.geometry = new SphereGeometry(5);

    new Mesh(this.geometry, this.material);
    this.initialPos = levelStart.clone();
    this.targetPos = levelEnd.clone();

    this.position.set(this.initialPos.x, this.initialPos.y, this.initialPos.z);
  }

  tick(delta: number) {
    this.position.add(this.calculateVelocity());
  }

  calculateVelocity() {
    // const clone = levelStart.clone();
    // const vel = clone.subVectors(levelEnd, levelStart);
    // return new Vector3(vel.x, vel.y, vel.z).normalize();
    let x = this.targetPos.x - this.initialPos.x;
    let y = this.targetPos.y - this.initialPos.y;
    let z = this.targetPos.z - this.initialPos.z;
    return new Vector3(x, y, z).normalize();
  }
}
