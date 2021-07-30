import { BufferGeometry, Line, Material, Vector3 } from 'three';
import { BinCode } from '../game/objects/Cell';

export const GROUND_WIDTH = 200;
export const GROUND_DEPTH = 200;
export let levelStart = new Vector3(-GROUND_WIDTH / 2, 10, GROUND_WIDTH / 2);
export let levelEnd = new Vector3(GROUND_WIDTH / 2, 10, -GROUND_WIDTH / 2);

export const drawLine = (pointA: Vector3, pointB: Vector3, material: Material) => {
  const geometry = new BufferGeometry().setFromPoints([pointA, pointB]);
  return new Line(geometry, material);
};

// prettier-ignore
export const binOptions: BinCode[] = [
  '1000','0100','0010','0001',
  '1100','0110','0011','1001',
  '0101','1010','1111','0000',
  '1011','1101','1110','0111',
];

export const randomBin = () => binOptions[Math.round(Math.random() * 15)];
