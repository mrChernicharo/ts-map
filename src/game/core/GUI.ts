import { GUI as THREEDatGUI } from 'three/examples/jsm/libs/dat.gui.module';
import { GROUND_DEPTH, GROUND_WIDTH, levelFinish, levelStart } from '../utils/constants';

export class GUI extends THREEDatGUI {
  [x: string]: any; // prevent TS errors. Couldn't make @types definitions work
  constructor() {
    super();

    // const tilesFolder = this.addFolder('🌎 Ground');
    // const width = tilesFolder.addFolder('width');
    // const depth = tilesFolder.addFolder('depth');

    // width.add(GROUND_WIDTH, 'GROUND_WIDTH', 100, 1000);
    // depth.add(GROUND_DEPTH, 'GROUND_DEPTH', 100, 1000);

    const flagsFolder = this.addFolder('⛳️ Flags');
    const startFlag = flagsFolder.addFolder('start');
    const endFlag = flagsFolder.addFolder('end');

    startFlag.add(levelStart, 'x', -GROUND_WIDTH / 2, GROUND_WIDTH / 2);
    // startFlag.add(levelStart, 'y', -GROUND_WIDTH / 2, GROUND_WIDTH / 2);
    startFlag.add(levelStart, 'z', -GROUND_DEPTH / 2, GROUND_DEPTH / 2);

    endFlag.add(levelFinish, 'x', -GROUND_WIDTH / 2, GROUND_WIDTH / 2);
    // endFlag.add(levelFinish, 'y', -GROUND_WIDTH / 2, GROUND_WIDTH / 2);
    endFlag.add(levelFinish, 'z', -GROUND_DEPTH / 2, GROUND_DEPTH / 2);

    // flagsFolder.open();
  }
}
