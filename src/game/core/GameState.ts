export class GameState {
  hovered: any[] = [];
  gold: number;
  castle: number;
  constructor() {
    this.gold = 100;
    this.castle = 10;

    console.log(this);
  }

  setHovered(obj: any) {
    this.hovered.push({ ...obj });
  }

  getHovered() {
    return this.hovered;
  }
}
