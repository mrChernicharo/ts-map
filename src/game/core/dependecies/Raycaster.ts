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
import { Tile } from '../../map/Tile/Tile';
import { Enemy } from '../../objects/Enemy/Enemy';
import {
	ENEMY_CLICK,
	ENEMY_HOVER,
	IDLE_CLICK,
	IDLE_HOVER,
	TILE_CLICK,
	TILE_HOVER,
} from '../../utils/constants';

export class Raycaster extends THREERaycaster {
	camera: Camera;
	scene: Scene;
	intersects: Intersection[];
	emitter: EventEmitter;
	constructor(camera: Camera, scene: Scene) {
		super();

		this.camera = camera;
		this.scene = scene;

		this.intersects = [];
		this.emitter = new EventEmitter();

		this.layers.set(0);
	}

	handleMouseMove(event: MouseEvent) {
		const mouse = this.normalizeMousePos(event);

		this.setFromCamera(mouse, this.camera);

		this._monitorIntersects();

		this.fireTileHoverEvent();
		// this.fireHoverEvents();
	}

	handleClick(event: MouseEvent) {
		console.log(event);
		event.preventDefault();
		event.stopPropagation();

		this.fireEnemyClickEvent();
		this.fireTileClickEvent();
	}

	_monitorIntersects() {
		this._clearIntersectedEfx();

		this.intersects = this.intersectObjects(this.scene.children, true);

		this._applyIntersectedEfx();
	}

	fireTileHoverEvent() {
		const tileIntersection = this.intersects.find(intersected => intersected.object.name === 'Tile');
		const tile = tileIntersection?.object;
		if (tile) {
			this.emitter.emit(TILE_HOVER, tile);
		} else {
			this.emitter.emit(IDLE_HOVER);
		}

		const enemyIntersection = this.intersects.find(intersected =>
			intersected.object.name.includes('Enemy')
		);
		const enemy = enemyIntersection?.object;
		if (enemy) {
			this.emitter.emit(ENEMY_HOVER, enemy.parent);
		}
	}

	fireEnemyClickEvent() {
		const enemyIntersection = this.intersects.find(intersected =>
			intersected.object.name.includes('Enemy')
		);
		const enemy = enemyIntersection?.object;
		if (enemy) {
			// console.log(enemy);
			this.emitter.emit(ENEMY_CLICK, enemy.parent);
		}
	}

	fireTileClickEvent() {
		const tileIntersection = this.intersects.find(intersected => intersected.object.name === 'Tile');
		const tile = tileIntersection?.object;
		if (tile) {
			this.emitter.emit(TILE_CLICK, tile);
		} else {
			this.emitter.emit(IDLE_CLICK);
		}
	}

	_applyIntersectedEfx() {
		this.intersects.forEach(intersect => {
			let obj = intersect.object as Mesh;

			if (obj.name.includes('circle')) {
				obj.material = new MeshToonMaterial({ color: 0x44ff11 });
			}

			if (obj.name === 'Ball') {
				obj.material = new MeshToonMaterial({ color: 0x44ff11 });
			}
		});
	}

	_clearIntersectedEfx() {
		this.intersects.forEach(intersect => {
			let obj = intersect.object as Mesh;

			if (obj.name.includes('circle')) {
				obj.material = new MeshToonMaterial({ color: (obj as any).hasWall ? 0x000000 : 0xffffff });
			}

			if (obj.name === 'Ball') {
				obj.material = new MeshToonMaterial({ color: 'purple' });
			}
		});
	}

	normalizeMousePos(event: MouseEvent) {
		// console.log(event);

		let x = (event.clientX / window.innerWidth) * 2 - 1;
		let y = -(event.clientY / window.innerHeight) * 2 + 1;
		return new Vector2(x, y);
	}
}
