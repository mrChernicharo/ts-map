import { AxesHelper, GridHelper, Vector3 } from 'three';
import { GROUND_WIDTH, cellSize } from './constants';

function createAxesHelper() {
  const helper = new AxesHelper(3);
  // helper.position.set(-3.5, 0, -3.5);
  helper.position.set(0, 10, 0);
  helper.scale.set(10, 10, 10);
  return helper;
}

function createGridHelper() {
  const helper = new GridHelper(GROUND_WIDTH);
  helper.position.y = cellSize;
  return helper;
}

export { createAxesHelper, createGridHelper };
