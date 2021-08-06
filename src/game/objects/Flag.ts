import { BoxBufferGeometry, Mesh, MeshToonMaterial, BoxGeometry, Vector3 } from 'three';

let i = -1;
const flagColors = [0xffff00, 0xff0000];

export class Flag extends Mesh {
  constructor(private pos: Vector3) {
    super();

    // pole
    this.material = new MeshToonMaterial({ color: 0xa9a9a9 });
    this.geometry = new BoxBufferGeometry(1, 40, 1);
    this.name = 'Flag';

    new Mesh(this.geometry, this.material);

    const flagGeo = new BoxGeometry(24, 12, 1);
    const flagMat = this.colorFlag();
    const flag = new Mesh(flagGeo, flagMat);
    flag.name = 'flag-cloth';

    this.add(flag);

    flag.translateX(-12);
    flag.translateY(12);
  }

  tick(delta: number) {
    this.position.set(this.pos.x, this.pos.y + 10, this.pos.z);
  }

  colorFlag() {
    ++i;
    return new MeshToonMaterial({ color: flagColors[i] });
  }
}
