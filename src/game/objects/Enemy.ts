import { ConeGeometry, Mesh, MeshPhongMaterial, Object3D } from 'three';
import { PathNode } from '../../utils/aStarPathfinder';
import { levelStart, pathFindingDelay } from '../../utils/constants';

export class Enemy extends Mesh {
  speed: number;
  path: PathNode[];
  constructor(speed) {
    super();

    this.speed = speed;

    this.material = new MeshPhongMaterial({ color: 0xff9d00 });
    this.geometry = new ConeGeometry(8, 20);

    new Mesh(this.geometry, this.material);

    const [x, y, z] = Object.values(levelStart);
    this.position.set(x, y + 12, z);

    this.init();
  }

  async init() {
    this.path = await this.getPath();
    console.log(this.path);
  }

  async getPath(): Promise<PathNode[]> {
    return new Promise((resolve, reject) => {
      let res: any;
      setTimeout(() => {
        res = this.parent.children.find(item => item.name === 'Ground');

        this.path.length ? resolve(res.path) : reject("couldn't get path nodes in time");
      }, pathFindingDelay);
    });
  }

  tick(delta) {}
}
