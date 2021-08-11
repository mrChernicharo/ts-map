import {
	Line,
	MathUtils,
	Mesh,
	MeshBasicMaterial,
	LineBasicMaterial,
	PlaneGeometry,
	Vector3,
	BufferGeometry,
	Material,
	BoxGeometry,
	LineDashedMaterial,
} from 'three';
import { AStarPathfinder, PathNode } from '../../helpers/aStarPathfinder';
// import { AStarPathfinder } from '../../utils/AStarPathfinder';
import {
	drawLine,
	cellSize,
	GROUND_DEPTH,
	GROUND_WIDTH,
	randomBin,
	Bin,
	idGenerator,
	BinCode,
	ZERO,
	levelStart,
	levelFinish,
	cellPoints,
} from '../../utils/constants';
import { PathSpot } from './PathSpot';
import { Cell, CellEdges } from './Cell';

export interface Spot {
	index: number;
	isWall: boolean;
	origin: Vector3;
	localPos: Vector3;
	name: string;
	// hl: number; // horizontal line  => // hl: Math.floor(i / (this.cols + 1)),
	// vl: number; // vertical line  => // vl: i % (this.cols + 1),
}

const idMaker = idGenerator();
const pathIntervalStep = undefined;

export class Ground extends Mesh {
	cols: number;
	rows: number;
	cells: Cell[] = [];
	spots: Spot[] = [];
	path: PathNode[] = [];
	pathfinder: AStarPathfinder;
	constructor() {
		super();

		this.cols = GROUND_WIDTH / cellSize;
		this.rows = GROUND_DEPTH / cellSize;

		this.geometry = new BoxGeometry(GROUND_WIDTH, 4, GROUND_DEPTH);
		this.material = new MeshBasicMaterial({ color: '#242424', wireframe: false });
		this.name = 'Ground';

		this.createGrid();
		this.getSpots();
		this.initPathFinder();
	}

	createGrid() {
		for (let r = 0; r < this.rows; r++) {
			for (let c = 0; c < this.cols; c++) {
				let edges: { a: Bin; b: Bin; c: Bin; d: Bin };

				const index = idMaker.next().value as number;

				let prev = this.cells[index - 1];
				let top = this.cells[index - this.cols];

				if (r === 0 && c === 0) {
					edges = { a: randomBin(), b: randomBin(), c: randomBin(), d: randomBin() };
				} else if (r === 0) {
					edges = { a: prev.edges.b, b: randomBin(), c: randomBin(), d: prev.edges.c };
				} else if (r > 0 && c === 0) {
					edges = { a: top.edges.d, b: top.edges.c, c: randomBin(), d: randomBin() };
				} else {
					edges = { a: top.edges.d, b: top.edges.c, c: randomBin(), d: prev.edges.c };
				}

				this.createCell(index, edges, r, c);
			}
		}
	}

	createCell(index: number, edges: CellEdges, r: number, c: number) {
		const originX = c * cellSize - GROUND_WIDTH / 2;
		const originY = r * cellSize - GROUND_DEPTH / 2;

		const origin = new Vector3(originX, 0, originY);

		const binCode = this.enhanceBinCode(origin, edges);

		const cell = new Cell(index, r, c, binCode, origin);
		cell.edges = edges;
		cell.name = `cell-${index}`;

		this.cells.push(cell);
		this.add(cell);
	}

	getSpots() {
		return this.cells
			.map(cell => cell.spots.filter(child => child.name.includes('spot')))
			.flat()
			.forEach((spot, i) => {
				this.spots.push(spot);
			});
	}
	enhanceBinCode(origin: Vector3, edges: CellEdges) {
		// prevents start/finish from being locked by walls:
		// forces bin '0' if edge is too close from start/finish
		const dists = {
			a: origin.clone().add(cellPoints.a),
			b: origin.clone().add(cellPoints.b),
			c: origin.clone().add(cellPoints.c),
			d: origin.clone().add(cellPoints.d),
		};

		Object.entries(dists).forEach(([key, distance]) => {
			if (
				distance.distanceTo(levelStart) < cellSize * 2 ||
				distance.distanceTo(levelFinish) < cellSize * 2
			) {
				edges[key] = '0';
			}
		});

		return (edges.a + edges.b + edges.c + edges.d) as BinCode;
	}

	initPathFinder() {
		this.pathfinder = new AStarPathfinder(this.spots, levelStart, levelFinish);

		const interval = setInterval(() => {
			//
			if (this.pathfinder.step() !== 0) {
				clearInterval(interval);

				this.path = this.pathfinder.getPathArray();
				this.createPathLine();

				// emit event notifying path completion
			}

			// this.drawPathSpots();
		}, pathIntervalStep);
	}

	createPathLine() {
		const pathMaterial = new LineDashedMaterial({ dashSize: 3, color: 0xff9d00 });
		const pathGeometry = [];

		this.path.forEach(n => {
			const pathLine = drawLine(n?.previous?.pos || levelStart, n.pos, pathMaterial);
			pathLine.position.y += 10;

			this.add(pathLine);
		});
	}

	drawPathSpots() {
		this.pathfinder.closedSet.forEach(node => this.add(new PathSpot(node.pos, 'closed')));
		this.pathfinder.openSet.forEach(node => this.add(new PathSpot(node.pos, 'open')));
		this.add(new PathSpot(this.pathfinder.lastCheckedNode.pos, 'current'));
	}
}
