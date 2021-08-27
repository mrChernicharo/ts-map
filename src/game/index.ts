import { GameState } from './core/dependecies/GameState';
import { Loop } from './core/Loop';
import { Scene } from './core/Scene';
import { EventsManager } from './managers/EventsManager';
import { PlayerStats } from './templates/PlayerStats';

export class Game {
	scene: Scene;
	loop: Loop;
	state: GameState;
	dom: EventsManager;

	constructor(domContainer: HTMLDivElement) {
		this.state = new GameState();
		this.scene = new Scene(domContainer, this.state);
		this.loop = new Loop(this.scene.camera, this.scene, this.scene.renderer, this.scene.eventsManager);

		domContainer.append(this.scene.renderer.domElement);
		this.scene.setSize(domContainer);

		document.addEventListener('visibilitychange', e => this.handleVisibilityChange(e));
	}

	start() {
		this.loop.start();
	}

	stop() {
		this.loop.stop();
	}

	handleVisibilityChange(e) {
		console.log(e, document.visibilityState);
		if (document.visibilityState === 'hidden') {
			this.stop();
		} else {
			this.start();
		}
	}
}
