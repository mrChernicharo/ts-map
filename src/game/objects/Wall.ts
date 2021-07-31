import { Mesh, MeshToonMaterial, Shape, ExtrudeGeometry, BoxGeometry, Vector3 } from 'three';
import { BinCode } from '../../utils/constants';
import { Cell } from './Cell';

export class Wall extends Mesh {
  material: MeshToonMaterial;
  constructor(cell: Cell) {
    super();

    this.material = new MeshToonMaterial({ color: 0x9a9a9a });
    // this.geometry = this.getGeometry(code);

    new Mesh(this.geometry, this.material);

    // console.log(cell.index);

    // this.position.set(origin.x + width / 2, origin.y + width / 2, origin.z + width / 2);
    // this.translateX(width / 2);
    // this.translateY(width / 2);
    // this.translateZ(width / 2);
  }
}

// const shape = new THREE.Shape();
// shape.moveTo( 0,0 );
// shape.lineTo( 0, width );
// shape.lineTo( length, width );
// shape.lineTo( length, 0 );
// shape.lineTo( 0, 0 );

// const extrudeSettings = {
// 	steps: 2,
// 	depth: 16,
// 	bevelEnabled: true,
// 	bevelThickness: 1,
// 	bevelSize: 1,
// 	bevelOffset: 0,
// 	bevelSegments: 1
// };

// const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
