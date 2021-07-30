import { BufferGeometry, Line, Material, Vector3 } from 'three';

export const GROUND_WIDTH = 200;
export const GROUND_DEPTH = 200;
export let levelStart = new Vector3(-GROUND_WIDTH / 2, 10, GROUND_WIDTH / 2);
export let levelEnd = new Vector3(GROUND_WIDTH / 2, 10, -GROUND_WIDTH / 2);

export const drawLine = (pointA: Vector3, pointB: Vector3, material: Material) => {
  const geometry = new BufferGeometry().setFromPoints([pointA, pointB]);
  return new Line(geometry, material);
};
