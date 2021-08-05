import { Raycaster as THREERaycaster, Scene, Vector2 } from 'three';
import { Camera } from './Camera';

export class Raycaster extends THREERaycaster {
  camera: Camera;
  scene: Scene;
  constructor(camera: Camera, scene: Scene) {
    super();

    this.camera = camera;
    this.scene = scene;
  }

  handleMouseMove(event) {
    let x = (event.clientX / window.innerWidth) * 2 - 1;
    let y = -(event.clientY / window.innerHeight) * 2 + 1;

    const mouse = new Vector2(x, y);

    this.setFromCamera(mouse, this.camera);
    // console.log(this);

    const intersects = this.intersectObjects(this.scene.children);

    for (let obj of intersects) {
      console.log({ intersects, obj });
    }

    // console.log({ x: mouse.x, y: mouse.y });
  }
}
