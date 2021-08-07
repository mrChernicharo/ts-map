import { Path, Vector2, Vector3 } from 'three';
import { Cell } from '../game/map/Cell';
import { Spot } from '../game/map/Ground';
import { tileSize } from './constants';
import { PathSpot } from './PathSpot';

interface Node {
  pos: Vector3;
  isWall: boolean;
  fScore: number;
  gScore: number;
  hScore: number; // Estimated distance to goal (heuristic determined)
  // getNeighbors?: () => Node[];
  getNeighbors?: (nodes: Node[]) => Node[];
  previous?: Node;
}

// const setInitialNode = (pos: Vector3) => ;

export class AStarPathfinder {
  openSet: Node[] = [];
  closedSet: Node[] = [];

  nodes: Node[] = [];
  spots: Spot[] = [];
  start: Vector3;
  goal: Vector3;

  constructor(spots: Spot[], start: Vector3, goal: Vector3) {
    this.start = start;
    this.goal = goal;
    this.spots = spots;
    this.openSet = [this.createNode(new Vector3(0, 0, 0), start, false)];
    this.initNodes();
  }

  initNodes() {
    this.spots.forEach(({ localPos, origin, isWall }) => {
      const node = this.createNode(localPos, origin, isWall);
      this.nodes.push(node);
    });

    // console.log({ nodes: this.nodes, start: this.start, goal: this.start });

    // this.nodes.forEach(n => console.log(n.getNeighbors(this.nodes)));
  }

  createNode(localPos, origin, isWall) {
    const pos = origin.clone().add(localPos.clone());

    const getNeighbors = function (nodes: Node[]) {
      const [o, far] = [new Vector2(0, 0), new Vector2(tileSize, tileSize)];
      return nodes.filter(
        n => n.pos.distanceTo(this.pos) <= Math.abs(o.distanceTo(far)) && n.pos.distanceTo(this.pos) !== 0
      );
    };

    const node: Node = {
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
    let lastCheckedNode: Node;
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
      lastCheckedNode = current;

      console.log({ closed: this.closedSet, open: this.openSet });

      // Did I finish?
      if (current.pos.distanceTo(this.goal) < 6) {
        console.log('DONE!');
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
      return 0;
      // Uh oh, no solution
    } else {
      console.log('no solution');
      return -1;
    }
  }
}
