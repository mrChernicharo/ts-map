import { GUI } from 'three/examples/jsm/libs/dat.gui.module';
import { GROUND_WIDTH, levelEnd, levelStart } from '../../utils/Level';

export class AppGUI extends GUI {
  [x: string]: any; // prevent TS errors. Couldn't make @types definitions work
  constructor() {
    super();

    const flagsFolder = this.addFolder('⛳️ Flags');
    const startFlag = flagsFolder.addFolder('start');
    const endFlag = flagsFolder.addFolder('end');

    startFlag.add(levelStart, 'x', -GROUND_WIDTH / 2, GROUND_WIDTH / 2);
    startFlag.add(levelStart, 'z', -GROUND_WIDTH / 2, GROUND_WIDTH / 2);

    endFlag.add(levelEnd, 'x', -GROUND_WIDTH / 2, GROUND_WIDTH / 2);
    endFlag.add(levelEnd, 'z', -GROUND_WIDTH / 2, GROUND_WIDTH / 2);

    // flagsFolder.open();
  }
}
