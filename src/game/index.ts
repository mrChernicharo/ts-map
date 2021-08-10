import { GameState } from './core/GameState';
import { Loop } from './core/Loop';
import { Scene } from './core/Scene';
import { EventsManager } from './helpers/EventsManager';
import { Title } from './templates/title';

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
		this.loop.setUp();
	}

	start() {
		this.loop.start();
	}

	stop() {
		this.loop.stop();
	}
}
