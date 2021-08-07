import { BufferGeometry, Line, Material, Vector3 } from 'three';

//prettier-ignore
export type BinCode = 
 '1000'| '0100' | '0010' | '0001' 
|'1100'| '0110' | '0011' | '1001'
|'0101'| '1010' | '1111' | '0000'
|'1011'| '1101' | '1110' | '0111'

export type Bin = '0' | '1';

export const ZERO = 0;
export const tileSize = 40;

export const GROUND_WIDTH = 800; // must be divisible by tileSize
export const GROUND_DEPTH = 280;

export const levelStart = new Vector3(-GROUND_WIDTH / 2, ZERO, GROUND_DEPTH / 2);
export const levelFinish = new Vector3(GROUND_WIDTH / 2, ZERO, -GROUND_DEPTH / 2);
// export const levelFinish = new Vector3(-GROUND_WIDTH / 2, ZERO, -GROUND_DEPTH / 2);

export const cellPoints = {
  a: new Vector3(0, 0, 0),
  b: new Vector3(tileSize, 0, 0),
  c: new Vector3(tileSize, 0, tileSize),
  d: new Vector3(0, 0, tileSize),
};

// prettier-ignore
export const binCodes: BinCode[] = [
  '1000','0100','0010','0001',
  '1100','0110','0011','1001',
  '0101','1010','1111','0000',
  '1011','1101','1110','0111',
];

export const binOptions: Bin[] = ['0', '0', '0', '0', '0', '0', '1', '1', '1', '1', '1']; // 40% chance

// export const randomBinCode = () => binCodes[Math.round(Math.random() * 15)];

export const randomBin = () => {
  const len = binOptions.length - 1;
  return binOptions[Math.round(Math.random() * len)];
};

export const drawLine = (pointA: Vector3, pointB: Vector3, material: Material) => {
  const geometry = new BufferGeometry().setFromPoints([pointA, pointB]);
  return new Line(geometry, material);
};

export function* idGenerator() {
  let id = 0;
  while (true) {
    yield id;
    id++;
  }
}
