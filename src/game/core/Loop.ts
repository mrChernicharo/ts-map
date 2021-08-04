import { Clock, Mesh, Quaternion, WebGL1Renderer } from 'three';
import { Camera } from './Camera';
import { Cube } from '../objects/Cube';
import { Scene } from './Scene';
import { Enemy } from '../objects/Enemy';
import { levelEnd, levelStart } from '../../utils/constants';
import { Flag } from '../objects/Flag';

interface IUpdatable extends Mesh {
  tick: (delta: number) => void;
}

const clock = new Clock();
let deltaSum = 0;

class Loop {
  updatables: IUpdatable[];
  constructor(private camera: Camera, private scene: Scene, private renderer: WebGL1Renderer) {
    this.updatables = [];
  }

  setUp() {
    // const [cube, cube2] = [new Cube(-10, 4, 20), new Cube(3, 4, 50)];
    // this.add(cube);
    // this.add(cube2);
    // const [startFlag, endFlag] = [new Flag(levelStart), new Flag(levelEnd)];
    // this.add(startFlag);
    // this.add(endFlag);
    // setInterval(() => this.add(new Enemy('sphere')), 1000);
  }

  start() {
    this.renderer.setAnimationLoop(() => {
      // tell every animated object to tick forward one frame
      this.tick();

      // render a frame
      this.renderer.render(this.scene, this.camera);
    });
  }

  stop() {
    this.renderer.setAnimationLoop(null);
  }

  add(item: any) {
    this.updatables.push(item);
    this.scene.add(item);
  }

  remove(id: string) {
    // const removingEl = this.updatables.find((item) => item.uuid === id);
    // this.updatables = this.updatables.filter((item) => item.uuid === id);
    // this.scene.remove(removingEl);
    // console.log({ updatables: this.updatables, removingEl, id });
  }

  tick() {
    const delta = clock.getDelta();
    // console.log(`The last frame rendered in ${delta * 1000} ms`);
    // 1 delta ~= 16.5 milliseconds -> 60 deltas/sec

    for (const object of this.updatables) {
      //   console.log(delta, this.updatables, object);
      object.tick(delta);
    }
  }
}

export { Loop };
