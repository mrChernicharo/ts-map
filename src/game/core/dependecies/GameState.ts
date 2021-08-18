import { Object3D } from 'three';

export class GameState {
  // focused: Object3D;
  gold: number;
  castle: number;
  constructor() {
    this.gold = 100;
    this.castle = 10;

    // console.log(this);
  }

  // setFocused(obj: Object3D) {
  //   this.focused = obj;
  // }

  // getFocused() {
  //   return this.focused;
  // }
}
