import { CircleGeometry, Mesh, MeshToonMaterial, Vector3 } from 'three';

export class PathSpot extends Mesh {
  constructor(pos: Vector3, closed: boolean) {
    super();
    this.geometry = new CircleGeometry(10);
    this.material = new MeshToonMaterial({ color: closed ? 0xff0000 : 0x00ff00 });

    new Mesh(this.geometry, this.material);
    this.position.set(pos.x, pos.y, pos.z);
    this.rotateX(-Math.PI / 2);
  }
}
