import { Vector2, Vector3 } from 'three';
import { Cell } from '../game/map/Cell';
import { Spot } from '../game/map/Ground';

interface Node {
  pos: Vector3;
  hasWall: boolean;
  fScore: number;
  gScore: number;
  hScore: number; // Estimated distance to goal (heuristic determined)
}

export class aStarPathfinder {
  open: Vector3[];
  closed: Vector3[];
  nodes: Vector3[];
  constructor(spots: Spot[], start: Vector3, goal: Vector3) {
    console.log(spots, start, goal);

    this.open = [start];
  }
}
