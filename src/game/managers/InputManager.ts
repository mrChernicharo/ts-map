import { Vector3 } from 'three';
import { Camera } from '../core/dependecies/Camera';
import { Scene } from '../core/Scene';

const logGen = generateLog();

export class InputManager {
	logger: any;
	camera: Camera;
	scene: Scene;
	constructor(camera: Camera, scene: Scene) {
		this.camera = camera;
		this.scene = scene;
	}

	handleKeyDown(event: KeyboardEvent) {
		let movement = new Vector3(0, 0, 0);

		if (event.code === 'KeyW') {
			movement.z -= 4;
		}
		if (event.code === 'KeyA') {
			movement.x -= 4;
		}
		if (event.code === 'KeyD') {
			movement.x += 4;
		}
		if (event.code === 'KeyS') {
			movement.z += 4;
		}
		if (event.code === 'Space') {
			console.log('Space keydown');
		}
		if (event.code === 'Escape') {
			console.log('Esc keydown');
		}

		// const [x, y, z] = Object.values(movement);
		this.camera.position.add(movement);
	}

	handleKeyUp(event: KeyboardEvent) {
		if (event.code === 'KeyW') {
			console.log('W keyup');
		}
		if (event.code === 'KeyA') {
			console.log('A keyup');
		}
		if (event.code === 'KeyD') {
			console.log('D keyup');
		}
		if (event.code === 'KeyS') {
			console.log('S keyup');
		}
		if (event.code === 'Space') {
			console.log('Space keyup');
		}
		if (event.code === 'Escape') {
			console.log('Esc keyup');
		}
	}
	handleMouseUp(event: MouseEvent) {
		logGen.next();
	}
	handleMouseDown(event: MouseEvent) {
		logGen.next();
	}
	handleMouseWheel(event: WheelEvent) {
		// console.log(event);
		logGen.next();
	}
}

function* generateLog() {
	let i = 0;

	while (i < 11) {
		// console.log(`${event.type} funciona, logs acabando em ${10 - i} eventos`);

		if (i === 10) {
			break;
		}

		i++;
		yield i;
	}
}
