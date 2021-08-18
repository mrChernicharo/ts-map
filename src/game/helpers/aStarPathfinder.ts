import { Vector2, Vector3 } from 'three';
import { Spot } from '../map/Land/Ground';
import { LoadingScreen } from '../templates/Loading';
import { cellSize } from '../utils/constants';

export interface PathNode {
	pos: Vector3;
	isWall: boolean;
	fScore: number;
	gScore: number;
	hScore: number; // Estimated distance to goal (heuristic determined)
	getNeighbors?: (nodes: PathNode[]) => PathNode[];
	previous?: PathNode;
	index?: number;
}

export class AStarPathfinder {
	openSet: PathNode[] = [];
	closedSet: PathNode[] = [];

	nodes: PathNode[] = [];
	spots: Spot[] = [];

	start: Vector3;
	goal: Vector3;
	lastCheckedNode: PathNode;

	loading: LoadingScreen;
	constructor(spots: Spot[], start: Vector3, goal: Vector3) {
		this.start = start;
		this.goal = goal;
		this.spots = spots;
		this.openSet = [this.createNode(new Vector3(0, 0, 0), start, false)];
		this.loading = new LoadingScreen();
		this.initNodes();
	}

	initNodes() {
		this.spots.forEach(({ localPos, origin, isWall }) => {
			const node = this.createNode(localPos, origin, isWall);
			this.nodes.push(node);
		});
	}

	createNode(localPos: Vector3, origin: Vector3, isWall: boolean) {
		const pos = origin.clone().add(localPos.clone());

		const getNeighbors = function (nodes: PathNode[]) {
			const [o, far] = [new Vector2(0, 0), new Vector2(cellSize, cellSize)];
			return nodes.filter(
				n =>
					n.pos.distanceTo(this.pos) <= Math.abs(o.distanceTo(far)) &&
					n.pos.distanceTo(this.pos) !== 0
			);
		};

		const node: PathNode = {
			fScore: 0,
			gScore: 0,
			hScore: 0,
			pos,
			isWall,
			getNeighbors,
		};

		return node;
	}

	heuristic(a: Vector3, b: Vector3) {
		return a.distanceTo(b);
	}

	removeFromArray(arr: any[], elt: any) {
		// Could use indexOf here instead to be more efficient
		for (let i = arr.length - 1; i >= 0; i--) {
			if (arr[i] == elt) {
				arr.splice(i, 1);
			}
		}
	}

	step() {
		if (this.openSet.length > 0) {
			// Best next option
			let winner = 0;
			for (let i = 1; i < this.openSet.length; i++) {
				if (this.openSet[i].fScore < this.openSet[winner].fScore) {
					winner = i;
				}
				//if we have a tie according to the standard heuristic
				if (this.openSet[i].fScore == this.openSet[winner].fScore) {
					//Prefer to explore options with longer known paths (closer to goal)
					if (this.openSet[i].gScore > this.openSet[winner].gScore) {
						winner = i;
					}
				}
			}
			let current = this.openSet[winner];
			this.lastCheckedNode = current;

			// Did I finish?
			if (current.pos.distanceTo(this.goal) < 3) {
				this.gameResolve(true);
				return 1;
			}

			// Best option moves from openSet to closedSet
			this.removeFromArray(this.openSet, current);
			this.closedSet.push(current);

			// Check all the neighbors
			let neighbors = current.getNeighbors(this.nodes);

			for (let i = 0; i < neighbors.length; i++) {
				let neighbor = neighbors[i];

				// Valid next spot?
				if (!this.closedSet.includes(neighbor) && !neighbor.isWall) {
					// Is this a better path than before?
					let tempG = current.gScore + this.heuristic(neighbor.pos, current.pos);

					// Is this a better path than before?
					if (!this.openSet.includes(neighbor)) {
						this.openSet.push(neighbor);
					} else if (tempG >= neighbor.gScore) {
						// No, it's not a better path
						continue;
					}

					neighbor.gScore = tempG;
					neighbor.hScore = this.heuristic(neighbor.pos, this.goal);
					neighbor.fScore = neighbor.gScore + neighbor.hScore;
					neighbor.previous = current;
				}
			}

			return 0; // and keep going!
		} else {
			this.gameResolve(false);
			return -1;
		}
	}

	getPathArray() {
		// hScore is the distance from the point till the goal

		const path: PathNode[] = [];
		let prevNode = this.lastCheckedNode;

		while (prevNode) {
			path.push(prevNode);
			prevNode = prevNode.previous;
		}

		if (!path.length) console.warn('loop step() method first to get the nodes!');

		return path.reverse().map((node, i) => ({ i, ...node }));
	}

	gameResolve(successful: boolean) {
		if (successful) {
			console.log('DONE! 😎');
			this.loading.done();
		} else {
			console.log('NO SOLUTION! 😅');
			window.location.reload();
		}
	}
}
