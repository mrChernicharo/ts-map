import { Scene } from './core/Scene';
import { Cube } from './objects/Cube';
import { Loop } from './core/Loop';
import { Ball } from './objects/Ball';

export class Game {
  scene: Scene;
  loop: Loop;

  constructor(domContainer: HTMLDivElement) {
    this.scene = new Scene(domContainer);
    this.loop = new Loop(this.scene.camera, this.scene, this.scene.renderer);

    domContainer.append(this.scene.renderer.domElement);
    this.scene.setSize(domContainer);
    this.loop.setUp();
  }

  start() {
    this.loop.start();
  }

  stop() {
    this.loop.stop();
  }
}
