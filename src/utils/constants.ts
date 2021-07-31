import { BufferGeometry, Line, Material, Vector3 } from 'three';

//prettier-ignore
export type BinCode = 
 '1000'| '0100' | '0010' | '0001' 
|'1100'| '0110' | '0011' | '1001'
|'0101'| '1010' | '1111' | '0000'
|'1011'| '1101' | '1110' | '0111'

export type Bin = '0' | '1';

export const GROUND_WIDTH = 400;
export const GROUND_DEPTH = 300;
export const tileSize = 50;

export const levelStart = new Vector3(-GROUND_WIDTH / 2, 10, GROUND_DEPTH / 2);
export const levelEnd = new Vector3(GROUND_WIDTH / 2, 10, -GROUND_DEPTH / 2);

// prettier-ignore
export const binCodes: BinCode[] = [
  '1000','0100','0010','0001',
  '1100','0110','0011','1001',
  '0101','1010','1111','0000',
  '1011','1101','1110','0111',
];

export const drawLine = (pointA: Vector3, pointB: Vector3, material: Material) => {
  const geometry = new BufferGeometry().setFromPoints([pointA, pointB]);
  return new Line(geometry, material);
};

export const binOptions: Bin[] = ['0', '1'];

export const randomBinCode = () => binCodes[Math.round(Math.random() * 15)];

export const randomBin = () => binOptions[Math.round(Math.random())];
