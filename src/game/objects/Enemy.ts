import { ConeGeometry, Mesh, MeshPhongMaterial, MeshToonMaterial, Object3D, Vector3 } from 'three';
import { PathNode } from '../../utils/aStarPathfinder';
import { levelStart, pathFindingDelay, cellSize } from '../../utils/constants';

export class Enemy extends Mesh {
  speed: number;
  path: Vector3[];
  nextPos: Vector3;
  velocity: Vector3;
  nxPathIdx = 1; // nextPathIndex
  constructor(speed) {
    super();

    this.speed = speed;

    this.init();
  }

  async init() {
    this.path = await this.getPathNodes();

    this.material = new MeshToonMaterial({ color: 0xff9d00 });
    this.geometry = new ConeGeometry(8, 20, 16);

    new Mesh(this.geometry, this.material);

    this.name = `Enemy-${this.id}`;

    const [x, y, z] = Object.values(this.path[0].clone());
    this.position.set(x, y, z);

    this.nextPos = this.path[this.nxPathIdx];
  }

  async getPathNodes(): Promise<Vector3[]> {
    console.log(`initializing enemy ${this.id}`);
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
    let nextClone = this.nextPos?.clone();

    // const y = pos.y;

    if (nextClone) {
      let next = new Vector3(nextClone.x, nextClone.y + 12, nextClone.z);
      this.velocity = pos.clone().sub(next).normalize();

      this.position.sub(this.velocity.multiplyScalar(delta * this.speed));

      if (this.position.distanceTo(next) < 4) {
        this.nxPathIdx += 1;
        this.nextPos = this.path[this.nxPathIdx];
      }
    }
  }
}
