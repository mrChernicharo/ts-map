import { PerspectiveCamera } from 'three';

export class Camera extends PerspectiveCamera {
  constructor() {
    super();

    new PerspectiveCamera();

    this.fov = 50; // Field Of View
    this.aspect = 1; // aspect ratio (dummy value)
    this.near = 0.5; // near clipping plane
    this.far = 3000; // far clipping plane

    this.position.set(400, 60, -480);

    this.lookAt(0, 0, 0);
  }

  init() {
    return this;
  }
}
