import { GameState } from './core/dependecies/GameState';
import { Loop } from './core/Loop';
import { Scene } from './core/Scene';
import { EventsManager } from './managers/EventsManager';

export class Game {
	scene: Scene;
	loop: Loop;
	state: GameState;
	dom: EventsManager;

	constructor(domContainer: HTMLDivElement) {
		this.state = new GameState();
		this.scene = new Scene(domContainer, this.state);
		this.loop = new Loop(this.scene.camera, this.scene, this.scene.renderer, this.scene.EventsManager);

		domContainer.append(this.scene.renderer.domElement);
		this.scene.setSize(domContainer);
	}

	start() {
		this.loop.start();
	}

	stop() {
		this.loop.stop();
	}
}
