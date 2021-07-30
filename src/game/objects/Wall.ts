import { Mesh, MeshToonMaterial, Shape, ExtrudeGeometry, BoxGeometry, Vector3 } from 'three';
import { BinCode } from './Cell';

export class Wall extends Mesh {
  material: MeshToonMaterial;
  constructor(private code: BinCode, private width: number, private origin: Vector3) {
    super();

    this.material = new MeshToonMaterial({ color: 0x9a9a9a });
    this.geometry = this.getGeometry(code);

    new Mesh(this.geometry, this.material);

    this.position.set(origin.x, origin.y, origin.z);
    this.translateX(width / 2);
    this.translateY(width / 2);
    this.translateZ(width / 2);
  }

  getGeometry(code: BinCode) {
    // let shape = new Shape();
    let geo;
    switch (code) {
      case '1111':
        geo = new BoxGeometry(this.width, 20, this.width);
        break;
      //   case '0001':

      //       break
      case '0000':
      default:
        geo = new BoxGeometry(this.width, 0, 0);
        break;
    }

    return geo;
  }
}

// const length = 12, width = 8;

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
// const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// const mesh = new THREE.Mesh( geometry, material ) ;
// scene.add( mesh );
