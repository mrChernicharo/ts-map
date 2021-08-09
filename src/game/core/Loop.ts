import { Clock, Mesh, Quaternion, Vector3, WebGL1Renderer } from 'three';
import { Camera } from './Camera';
import { Cube } from '../objects/Cube';
import { Scene } from './Scene';
import { Ball } from '../objects/Ball';
import { enemyGenerator, levelFinish, levelStart, random } from '../../utils/constants';
import { Flag } from '../objects/Flag';
import { Enemy } from '../objects/Enemy';

interface IUpdatable extends Mesh {
  tick: (delta: number) => void;
}

const clock = new Clock();
const enemyGen = enemyGenerator(100);
const enemyInterval = 4;

class Loop {
  updatables: IUpdatable[];
  constructor(private camera: Camera, private scene: Scene, private renderer: WebGL1Renderer) {
    this.updatables = [];
  }

  setUp() {
    const [startFlag, endFlag] = [new Flag(levelStart), new Flag(levelFinish)];
    this.add(startFlag);
    this.add(endFlag);

    // const enemy = new Enemy(40);

    // this.add(enemy);
  }

  start() {
    this.renderer.setAnimationLoop(() => {
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

  remove() {
    // const removingEl = this.updatables.find((item) => item.uuid === id);
    // this.updatables = this.updatables.filter((item) => item.uuid === id);
    // this.scene.remove(removingEl);
    // console.log({ updatables: this.updatables, removingEl, id });
  }

  tick() {
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime();

    // console.log(random(20));

    if ((elapsed % enemyInterval) + delta >= enemyInterval) {
      const enemy = enemyGen.next().value;

      if (enemy) this.add(enemy);
    }

    // if ((elapsed % 10) + delta >= 10) {
    //   console.log(this.updatables);
    // }

    for (const object of this.updatables) {
      //   console.log(delta, this.updatables, object);
      object.tick(delta);
    }
  }
}

export { Loop };
