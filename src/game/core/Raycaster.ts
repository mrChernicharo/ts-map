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
import { EventEmitter } from 'events';
import { GameState } from './GameState';

export class Raycaster extends THREERaycaster {
  camera: Camera;
  scene: Scene;
  intersects: Intersection[];
  raycasterEmitter: EventEmitter;
  constructor(camera: Camera, scene: Scene, private gameState: GameState) {
    super();

    this.camera = camera;
    this.scene = scene;

    this.intersects = [];
    this.raycasterEmitter = new EventEmitter();

    this.layers.set(0);

    this.raycasterEmitter.on('tileHover', e => {});
    this.raycasterEmitter.on('enemyHover', e => {});
    this.raycasterEmitter.on('tileClick', e => {});
  }

  handleMouseMove(event: MouseEvent) {
    const mouse = this.normalizeMousePos(event);

    this.setFromCamera(mouse, this.camera);

    this.monitorIntersects();

    this.fireHoverEvents();
  }

  handleClick(event: MouseEvent) {
    console.log(event);
    this.updateState(this.gameState);
  }

  monitorIntersects() {
    this._clearIntersectedEfx();

    this.intersects = this.intersectObjects(this.scene.children, true);

    this._applyIntersectedEfx();
  }

  updateState(state: GameState) {
    state.hovered = this.intersects.filter(int => int.object.name === 'Tile');

    console.log(state);
  }

  fireHoverEvents() {
    const tile = this.intersects.find(intersected => intersected.object.name === 'Tile');
    if (tile) {
      this.raycasterEmitter.emit('tileHover', tile);
    }

    const enemy = this.intersects.find(intersected => intersected.object.name.includes('Enemy'));
    if (enemy) {
      this.raycasterEmitter.emit('enemyHover', enemy);
    }
  }
  _applyIntersectedEfx() {
    this.intersects.forEach(intersect => {
      let obj = intersect.object as Mesh;

      if (obj.name.includes('Wall')) {
      }

      if (obj.name === 'Tile') {
        (obj as any).material.transparent = false;
        (obj as any).material.opacity = 1;
      }

      if (obj.name.includes('circle')) {
        obj.material = new MeshToonMaterial({ color: 0x44ff11 });
      }

      if (obj.name === 'Ball') {
        obj.material = new MeshToonMaterial({ color: 0x44ff11 });
      }

      if (obj.name.includes('Enemy')) {
        obj.material = new MeshToonMaterial({ color: 0x44ff11, wireframe: true });
      }
    });
  }
  _clearIntersectedEfx() {
    this.intersects.forEach(intersect => {
      let obj = intersect.object as Mesh;

      if (obj.name.includes('Wall')) {
      }

      if (obj.name === 'Tile') {
        (obj as any).material.transparent = true;
        (obj as any).material.opacity = 0.8;
      }

      if (obj.name.includes('circle')) {
        obj.material = new MeshToonMaterial({ color: (obj as any).hasWall ? 0x000000 : 0xffffff });
      }

      if (obj.name === 'Ball') {
        obj.material = new MeshToonMaterial({ color: 'purple' });
      }

      if (obj.name.includes('Enemy')) {
        obj.material = new MeshToonMaterial({ color: 0xff9d00 });
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
