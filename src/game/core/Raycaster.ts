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
import { Tile } from '../map/Tile';
import { Enemy } from '../objects/Enemy';

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

    this.raycasterEmitter.on('tileHover', (e: Tile) => {
      // console.log(e);
    });
    this.raycasterEmitter.on('enemyHover', (e: Enemy) => {
      // console.log(e);
    });
    this.raycasterEmitter.on('tileClick', (e: Tile) => {
      console.log(e);
      return e;
    });
    this.raycasterEmitter.on('enemyClick', (e: Enemy) => {
      console.log(e);
    });
  }

  handleMouseMove(event: MouseEvent) {
    const mouse = this.normalizeMousePos(event);

    this.setFromCamera(mouse, this.camera);

    this.monitorIntersects();

    this.fireHoverEvent();
  }

  handleClick(event: MouseEvent) {
    console.log(event);
    this.fireClickEvent();
  }

  monitorIntersects() {
    this._clearIntersectedEfx();

    this.intersects = this.intersectObjects(this.scene.children, true);

    this._applyIntersectedEfx();
  }

  fireHoverEvent() {
    const tileIntersection = this.intersects.find(intersected => intersected.object.name === 'Tile');
    const tile = tileIntersection?.object;
    if (tile) {
      this.raycasterEmitter.emit('tileHover', tile);
    }

    const enemyIntersection = this.intersects.find(intersected => intersected.object.name.includes('Enemy'));
    const enemy = enemyIntersection?.object;
    if (enemy) {
      this.raycasterEmitter.emit('enemyHover', enemy);
    }
  }

  fireClickEvent() {
    const tileIntersection = this.intersects.find(intersected => intersected.object.name === 'Tile');
    const tile = tileIntersection?.object;
    if (tile) {
      this.raycasterEmitter.emit('tileClick', tile);
    }

    const enemyIntersection = this.intersects.find(intersected => intersected.object.name.includes('Enemy'));
    const enemy = enemyIntersection?.object;
    if (enemy) {
      this.raycasterEmitter.emit('enemyClick', enemy);
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
