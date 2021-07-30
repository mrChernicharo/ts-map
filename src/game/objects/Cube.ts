import { BoxBufferGeometry, MathUtils, Mesh, MeshToonMaterial } from 'three';

export class Cube extends Mesh {
  constructor(x: number, y: number, z: number) {
    super();

    this.material = new MeshToonMaterial({ color: 'orange', clipShadows: true });
    this.geometry = new BoxBufferGeometry(8, 8, 8);

    new Mesh(this.geometry, this.material);

    this.position.set(x, y, z);
  }

  tick(delta: number) {
    const radiansPerSecond = MathUtils.degToRad(30);
    this.rotation.y += radiansPerSecond * delta;

    this.position.x += delta;
  }
}
