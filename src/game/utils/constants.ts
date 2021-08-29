import { BufferGeometry, Line, Material, Vector3 } from 'three';
import { Enemy } from '../objects/Enemy/Enemy';
import { Tower } from '../objects/Tower/Tower';

export const PLAYER_LIVES = 10;

//prettier-ignore
export type BinCode = 
 '1000'| '0100' | '0010' | '0001' 
|'1100'| '0110' | '0011' | '1001'
|'0101'| '1010' | '1111' | '0000'
|'1011'| '1101' | '1110' | '0111'

export type Bin = '0' | '1';

export const ZERO = 0;
export const cellSize = 40; //depth and width must be divisible by cellSize

export const GROUND_WIDTH = 400;
export const GROUND_DEPTH = 600;

export const levelStart = new Vector3(-GROUND_WIDTH / 2, ZERO, GROUND_DEPTH / 2);
export const levelFinish = new Vector3(GROUND_WIDTH / 2, ZERO, -GROUND_DEPTH / 2);
// export const levelFinish = new Vector3(-GROUND_WIDTH / 2, ZERO, -GROUND_DEPTH / 2);

export const enemyInterval = 2;

export const pathFindingDelay = GROUND_WIDTH * GROUND_DEPTH * 0.0024;

export const cellPoints = {
	a: new Vector3(0, 0, 0),
	b: new Vector3(cellSize, 0, 0),
	c: new Vector3(cellSize, 0, cellSize),
	d: new Vector3(0, 0, cellSize),
};

export const ENEMY_DEFAULTS = {
	// speed: 200,
	speed: 30,
	interval: 1,
};

export const missileMods = {
	x: 0,
	y: 0,
	z: 0,
};

// prettier-ignore
export const binCodes: BinCode[] = [
  '1000','0100','0010','0001',
  '1100','0110','0011','1001',
  '0101','1010','1111','0000',
  '1011','1101','1110','0111',
];

export const binOptions: Bin[] = ['1', '0', '0', '0', '0', '1', '1', '1', '1', '1', '1']; // 40% chance

export const GAME_READY = 'gameReady';

export const ADD_TO_LOOP = 'addToLoop';
export const HURT_PLAYER = 'hurtPlayer';

export const IDLE_CLICK = 'idleClick';
export const IDLE_HOVER = 'idleHover';
export const TILE_HOVER = 'tileHover';
export const TILE_CLICK = 'tileClick';
export const CLEAR_TILE = 'clearTile';

export const ENEMY_HOVER = 'enemyHover';
export const ENEMY_CLICK = 'enemyClick';
export const INFLICT_DAMAGE = 'inflictDamage';

export const CREATE_TOWER = 'createTower';
export const TOWER_CREATED = 'towerCreated';
export const TOWER_SOLD = 'towerSold';

export const MISSILE_FIRED = 'missileFired';

// export const randomBinCode = () => binCodes[Math.round(Math.random() * 15)];

export const buyModalIcons = {
	price: 'fas fa-coins',
};
export const sellModalIcons = {
	price: 'fas fa-coins',
	tower: 'fas fa-archway',
};
export const towerFeatIcons = {
	damage: 'fas fa-bolt',
	range: 'fas fa-circle-notch',
	fireRate: 'fas fa-meteor',
};

export const playerIcons = {
	life: 'fab fa-diaspora',
	gold: 'fas fa-coins',
};
