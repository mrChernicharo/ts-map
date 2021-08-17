import { PolyhedronGeometry, Mesh, MeshPhongMaterial } from 'three';
import { Scene } from '../../core/Scene';

export class Polyhedron {
	constructor(scene: Scene) {
		//prettier-ignore
		const verticesOfCube = [ 
            -1,-1,-1,    1,-1,-1,    1, 1,-1,    -1, 1,-1,
            -1,-1, 1,    1,-1, 1,    1, 1, 1,    -1, 1, 1
        ];

		//prettier-ignore
		const indicesOfFaces = [
            2,1,0,    0,3,2,
            0,4,7,    7,3,0,
            0,1,5,    5,4,0,
            1,2,6,    6,5,1,
            2,3,7,    7,6,2,
            4,5,6,    6,7,4
        ];
		const [radius, detail] = [20, 1];
		const geometry = new PolyhedronGeometry(verticesOfCube, indicesOfFaces, radius, detail);

		const mesh = new Mesh(geometry, new MeshPhongMaterial({ color: 0xffffff, wireframe: true }));
		mesh.position.set(0, 40, 0);
		scene.add(mesh);
	}

	tick() {}
}
