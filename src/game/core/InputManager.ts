const logGen = generateLog();

export class InputManager {
  logger: any;
  constructor() {}

  handleKeyDown(event: KeyboardEvent) {
    if (event.code === 'KeyW') {
      console.log('W keydown');
    }
    if (event.code === 'KeyA') {
      console.log('A keydown');
    }
    if (event.code === 'KeyD') {
      console.log('D keydown');
    }
    if (event.code === 'KeyS') {
      console.log('S keydown');
    }
    if (event.code === 'Space') {
      console.log('Space keydown');
    }
    if (event.code === 'Escape') {
      console.log('Esc keydown');
    }
  }
  handleKeyUp(event: KeyboardEvent) {
    if (event.code === 'KeyW') {
      console.log('W keyup');
    }
    if (event.code === 'KeyA') {
      console.log('A keyup');
    }
    if (event.code === 'KeyD') {
      console.log('D keyup');
    }
    if (event.code === 'KeyS') {
      console.log('S keyup');
    }
    if (event.code === 'Space') {
      console.log('Space keyup');
    }
    if (event.code === 'Escape') {
      console.log('Esc keyup');
    }
  }
  handleMouseUp(event: MouseEvent) {
    logGen.next();

    // console.log(event);
  }
  handleMouseDown(event: MouseEvent) {
    logGen.next();
  }
  handleMouseWheel(event: WheelEvent) {
    logGen.next();
  }
}

function* generateLog() {
  let i = 0;

  while (i < 11) {
    // console.log(`${event.type} funciona, logs acabando em ${10 - i} eventos`);

    if (i === 10) {
      break;
    }

    i++;
    yield i;
  }
}
