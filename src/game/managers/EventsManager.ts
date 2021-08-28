import { EventEmitter } from 'events';
import { Raycaster } from '../core/dependecies/Raycaster';
import { TOWER_CREATED, TOWER_SOLD } from '../utils/constants';
import { TilesManager } from '../map/Tile/TilesManager';
import { Scene } from '../core/Scene';
import { Tower } from '../objects/Tower/Tower';

export class EventsManager {
	scene: Scene;
	raycaster: Raycaster;
	TilesManager: TilesManager;
	emitter: EventEmitter;
	constructor(scene: Scene) {
		this.scene = scene;

		this.emitter = new EventEmitter();

		this._init();
	}

	_init() {
		this.raycaster = new Raycaster(this.scene.camera, this.scene);
		this.TilesManager = new TilesManager(this.raycaster);

		this.setRaycasterEvents();
		this.setObjectsEvents();
	}

	setRaycasterEvents() {
		window.addEventListener('mousemove', e => this.raycaster.handleMouseMove(e));

		window.addEventListener('mousedown', e => {
			this.TilesManager.towerModal.close();
			this.raycaster.handleClick(e);
		});
	}

	setObjectsEvents() {
		this.TilesManager.emitter.on(TOWER_CREATED, (tower: Tower) =>
			this.emitter.emit(TOWER_CREATED, tower)
		);

		this.TilesManager.emitter.on(TOWER_SOLD, (tower: Tower) => this.emitter.emit(TOWER_SOLD, tower));
	}
}

{
	// setWindowEvents() {
	// 	window.addEventListener('keydown', e => this.inputManager.handleKeyDown(e));
	// 	window.addEventListener('keyup', e => this.inputManager.handleKeyUp(e));
	// 	window.addEventListener('mousedown', e => this.inputManager.handleMouseDown(e));
	// 	window.addEventListener('mouseup', e => this.inputManager.handleMouseUp(e));
	// 	window.addEventListener('mousewheel', this.inputManager.handleMouseWheel);
	// }
}
