export interface ITowers {
	[key: string]: {
		title: string;
		topRadius: number;
		bottomRadius: number;
		height: number;
		range: number;
		rangeRadiusColor: number;
		rangeRadiusHeight: number;
		color: number;
		fireRate: number;
		damage: number;
		price: number;
		sellPrice: () => number;
	};
}

export const towerModels: ITowers = {
	machineGun: {
		title: 'machine gun',
		topRadius: 8,
		bottomRadius: 9,
		height: 40,
		range: 95,
		rangeRadiusColor: 0x0056ed,
		rangeRadiusHeight: -38,
		color: 0x8a8a8a,
		fireRate: 120, // 2 shots/s
		damage: 8,
		price: 45,
		sellPrice: getPrice,
	},
	shotgun: {
		title: 'shotgun',
		topRadius: 10,
		bottomRadius: 12,
		height: 25,
		range: 80,
		rangeRadiusColor: 0xed1067,
		rangeRadiusHeight: -32,
		color: 0x232323,
		fireRate: 40,
		damage: 36,
		price: 70,
		sellPrice: getPrice,
	},
	rifle: {
		title: 'rifle',
		topRadius: 6,
		bottomRadius: 7,
		height: 50,
		range: 130,
		rangeRadiusColor: 0x00ab34,
		rangeRadiusHeight: -40,
		color: 0xdedede,
		fireRate: 24,
		damage: 52,
		price: 100,
		sellPrice: getPrice,
	},
};

function getPrice() {
	return Math.round(this.price * 0.65);
}
