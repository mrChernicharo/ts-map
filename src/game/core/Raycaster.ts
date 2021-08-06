import {
  Intersection,
  Mesh,
  MeshBasicMaterial,
  MeshToonMaterial,
  Object3D,
  Raycaster as THREERaycaster,
  Scene,
  Vector2,
} from 'three';
import { Camera } from './Camera';

export class Raycaster extends THREERaycaster {
  camera: Camera;
  scene: Scene;
  intersects: Intersection[];
  constructor(camera: Camera, scene: Scene) {
    super();

    this.camera = camera;
    this.scene = scene;
    this.intersects = [];

    this.layers.set(0);
  }

  handleMouseMove(event: MouseEvent) {
    const mouse = this.normalizeMousePos(event);

    this.setFromCamera(mouse, this.camera);

    this.removeEffectFromNonIntersected();

    this.intersects = this.intersectObjects(this.scene.children, true);

    this.higlightIntersectedObjects();
  }

  higlightIntersectedObjects() {
    this.intersects.forEach(intersect => {
      let mesh = intersect.object as Mesh;
      // console.log(intersect.object.name);

      if (mesh.name.includes('Wall')) {
        (mesh as any).material.transparent = true;
        (mesh as any).material.opacity = 0.8;
      }

      if (mesh.name.includes('circle')) {
        mesh.material = new MeshToonMaterial({ color: 0x44ff11 });
      }

      if (mesh.name === 'Ball') {
        mesh.material = new MeshToonMaterial({ color: 0x44ff11 });
      }
    });
  }

  removeEffectFromNonIntersected() {
    this.intersects.forEach(intersect => {
      let mesh = intersect.object as Mesh;

      if (mesh.name.includes('Wall')) {
        (mesh as any).material.transparent = false;
        (mesh as any).material.opacity = 1;
      }

      if (mesh.name.includes('circle')) {
        mesh.material = new MeshToonMaterial({ color: (mesh as any).hasWall ? 0x000000 : 0xffffff });
      }

      if (mesh.name === 'Ball') {
        mesh.material = new MeshToonMaterial({ color: 'purple' });
      }
    });
  }

  normalizeMousePos(event: MouseEvent) {
    let x = (event.clientX / window.innerWidth) * 2 - 1;
    let y = -(event.clientY / window.innerHeight) * 2 + 1;
    return new Vector2(x, y);
  }
}

// const ground = this.scene.children[0];
// this.intersects = this.intersectObjects([ground], true);
