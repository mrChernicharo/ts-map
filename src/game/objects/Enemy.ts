import { ConeGeometry, Mesh, MeshPhongMaterial, MeshToonMaterial, Object3D, Vector3 } from 'three';
import { PathNode } from '../../utils/aStarPathfinder';
import { levelStart, pathFindingDelay, tileSize } from '../../utils/constants';

export class Enemy extends Mesh {
  speed: number;
  path: Vector3[];
  nextPos: Vector3;
  velocity: Vector3;
  nxPathIdx = 1; // nextPathIndex
  constructor(speed) {
    super();

    this.speed = speed;

    this.material = new MeshToonMaterial({ color: 0xff9d00 });
    this.geometry = new ConeGeometry(8, 20, 16);

    this.init();
  }

  async init() {
    new Mesh(this.geometry, this.material);

    const [x, y, z] = Object.values(levelStart.clone());
    this.position.set(x, y, z);
    this.translateY(12);

    this.path = await this.getPath();
    this.nextPos = this.path[this.nxPathIdx];

    console.log(this.path);
    console.log({ pos: this.position, next: this.nextPos, levelStart });
  }

  async getPath(): Promise<Vector3[]> {
    return new Promise((resolve, reject) => {
      let ground: any;

      setTimeout(() => {
        ground = this.parent.children.find(item => item.name === 'Ground');

        ground.path.length
          ? resolve(ground.path.map((node: PathNode) => node.pos))
          : reject("couldn't get path nodes in time!");
        // }, 0);
        // }, 1000);
      }, pathFindingDelay);
    });
  }

  tick(delta) {
    let pos = this.position.clone();
    let next = this.nextPos?.clone();
    // const y = pos.y;

    if (next) {
      this.velocity = pos.clone().sub(next).normalize();

      // console.log(pos, next, this.velocity);
      this.position.sub(this.velocity);

      // this.position.y = y;

      if (this.position.distanceTo(next) < 4) {
        this.nxPathIdx += 1;
        this.nextPos = this.path[this.nxPathIdx];
        this.translateY(12);
      }
    }
  }
}
