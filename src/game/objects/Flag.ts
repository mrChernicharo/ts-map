import { BoxBufferGeometry, Mesh, MeshToonMaterial, BoxGeometry } from 'three';

export class Flag extends Mesh {
  constructor(x: number, y: number, z: number) {
    super();

    this.material = new MeshToonMaterial({ color: 'blue' });
    this.geometry = new BoxBufferGeometry(1, 40, 1);

    new Mesh(this.geometry, this.material);

    const flagGeo = new BoxGeometry(24, 12, 1);
    const flagMat = new MeshToonMaterial({ color: 'red' });
    const flag = new Mesh(flagGeo, flagMat);

    this.add(flag);

    flag.translateX(-12);
    flag.translateY(12);

    this.position.set(x, y + 10, z);
  }
}
