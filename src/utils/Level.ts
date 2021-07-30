import { BufferGeometry, Line, Material, Vector3 } from 'three';

export const levelStart = new Vector3(-200, 10, 200);
export const levelEnd = new Vector3(200, 10, -180);

export const GROUND_WIDTH = 400;
export const GROUND_DEPTH = 400;

export const drawLine = (pointA: Vector3, pointB: Vector3, material: Material) => {
  const geometry = new BufferGeometry().setFromPoints([pointA, pointB]);
  return new Line(geometry, material);
};
