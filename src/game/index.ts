import { Scene } from './core/Scene';
import { Loop } from './core/Loop';
import { GameState } from './core/GameState';
import { DOMManager } from './templates/DOMManager';

export class Game {
  scene: Scene;
  loop: Loop;
  state: GameState;
  dom: DOMManager;

  constructor(domContainer: HTMLDivElement) {
    this.state = new GameState();
    this.scene = new Scene(domContainer, this.state);
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
