import { Mesh, MeshToonMaterial, Shape, ExtrudeGeometry, BoxGeometry, Vector3 } from 'three';
import { BinCode, tileSize } from '../../utils/constants';
import { Cell, INeighbors } from './Cell';

export class Wall extends Mesh {
  material: MeshToonMaterial;
  constructor(cell: Cell) {
    super();

    this.material = new MeshToonMaterial({ color: 0x9a9a9a });
    this.geometry = new BoxGeometry(cell.width, cell.width, cell.width);

    new Mesh(this.geometry, this.material);

    this.rotateX(Math.PI / 2);
    const [x, y, z] = [
      cell.origin.x + tileSize / 2,
      cell.origin.y + tileSize / 2,
      cell.origin.z + tileSize / 2,
    ];
    this.position.set(x, y, z);

    const binCode = this.getCodeFromNeighborsBins(cell.neighbors);
    this.setGeometry(cell, binCode);
  }

  getCodeFromNeighborsBins(neighbors: INeighbors) {
    let code = '';
    for (let side of Object.keys(neighbors)) {
      code += neighbors[side]?.code || '0';
    }

    return code as BinCode;
  }

  setGeometry(cell: Cell, binCode: BinCode) {
    const w = cell.width;
    const w2 = cell.width / 2;
    let geometry: BoxGeometry | ExtrudeGeometry;
    let shape = new Shape();
    shape.moveTo(-w2, -w2);
    shape.lineTo(-w2, 0);
    shape.lineTo(0, -w2);

    // shape.lineTo(w, 0);
    // shape.lineTo(0, 0);

    const extrudeSettings = {
      steps: 2,
      depth: w,
      bevelEnabled: false,
      bevelThickness: 0,
      bevelSize: 12,
      bevelOffset: 0,
      bevelSegments: 0,
    };

    if (binCode === '1111') {
      geometry = new BoxGeometry(w, w, w);
      //
    } else if (binCode === '1000') {
      // geometry = new BoxGeometry(0, 0, 0);
      //
      geometry = new ExtrudeGeometry(shape, extrudeSettings);
      geometry
        .translate(0, 0, -w2)
        .rotateX(-Math.PI / 2)
        .rotateY(-Math.PI / 2);
      // //
    } else if (binCode === '0100') {
      // geometry = new BoxGeometry(0, 0, 0);
      //
      geometry = new ExtrudeGeometry(shape, extrudeSettings);
      geometry
        .translate(0, 0, -w2)
        .rotateX(Math.PI / 2)
        .rotateY(-Math.PI / 2);
      //
    } else if (binCode === '0010') {
      // geometry = new BoxGeometry(0, 0, 0);

      //
      geometry = new ExtrudeGeometry(shape, extrudeSettings);
      geometry
        .translate(0, 0, -w2)
        .rotateX(-Math.PI / 2)
        .rotateY(Math.PI / 2);
      //
    } else if (binCode === '0001') {
      // geometry = new BoxGeometry(0, 0, 0);
      //
      geometry = new ExtrudeGeometry(shape, extrudeSettings);
      geometry
        .translate(0, 0, -w2)
        .rotateX(Math.PI / 2)
        .rotateY(Math.PI / 2);
    } else {
      // 0000
      geometry = new BoxGeometry(0, 0, 0);
    }

    this.geometry = geometry;
  }

  makePolygon() {}
}

// const geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
