import { Camera } from 'three';
import { OrbitControls as THREEOrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export class OrbitControls extends THREEOrbitControls {
	constructor(camera: Camera, domContainer: HTMLDivElement) {
		super(camera, domContainer);

		this.enableDamping = true;
		this.maxPolarAngle = Math.PI / 2;
	}
}
