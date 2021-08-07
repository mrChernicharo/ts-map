import { CircleGeometry, Mesh, MeshToonMaterial, Vector3 } from 'three';

export type pathSpotType = 'current' | 'open' | 'closed';

const colors = {
  current: 0xff0000,
  open: 0x00ff00,
  closed: 0x0056ff,
};

export class PathSpot extends Mesh {
  constructor(pos: Vector3, type: pathSpotType) {
    super();
    this.geometry = new CircleGeometry(10);
    this.material = new MeshToonMaterial({ color: colors[type] });

    new Mesh(this.geometry, this.material);
    this.position.set(pos.x, pos.y, pos.z);
    this.rotateX(-Math.PI / 2);
  }
}
