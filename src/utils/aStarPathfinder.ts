import { Vector2, Vector3 } from 'three';
import { Cell } from '../game/map/Cell';
import { Spot } from '../game/map/Ground';

interface Node {
  pos: Vector3;
  isWall: boolean;
  fScore: number;
  gScore: number;
  hScore: number; // Estimated distance to goal (heuristic determined)
}

export class aStarPathfinder {
  open: Vector3[];
  closed: Vector3[];
  nodes: Node[] = [];
  constructor(spots: Spot[], start: Vector3, goal: Vector3) {
    this.open = [start];

    spots.forEach(({ localPos, origin, isWall }) => {
      const pos = origin.clone().add(localPos.clone());
      const node: Node = {
        fScore: 0,
        gScore: 0,
        hScore: 0,
        pos,
        isWall,
      };
      this.nodes.push(node);
    });

    // console.log(this.heuristic(this.nodes[0].pos, this.nodes[this.nodes.length - 1].pos));
    // console.log(this.heuristic(this.nodes[0].pos, this.nodes[1].pos));
    // console.log(this.heuristic(this.nodes[0].pos, this.nodes[2].pos));
    // console.log(this.heuristic(this.nodes[0].pos, this.nodes[3].pos));
    // console.log(this.heuristic(start, goal));
    console.log(this.nodes, start, goal);
  }

  heuristic(a: Vector3, b: Vector3) {
    return a.distanceTo(b);
  }
}
