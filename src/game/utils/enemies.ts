import { Group, MeshToonMaterial, BoxGeometry, Mesh, Shape, ExtrudeGeometry, CylinderGeometry } from 'three';

export const enemyModels = {
	jeep: {
		title: 'jeep',
		geometryFn: (enemy, color) => jeepGeometry(enemy, color),
	},
};

function jeepGeometry(enemy, color) {
	const wheelPositions = (size: number) => ({
		a: { x: -size, y: -size },
		b: { x: size, y: -size },
		c: { x: size, y: size },
		d: { x: -size, y: size },
	});

	const [x, y, z] = Object.values(enemy.path[0].clone());
	enemy.position.set(x, y + 4, z);

	const material = new MeshToonMaterial({ color });
	const geometry = new BoxGeometry(8, 4, 12);
	const core = new Mesh(geometry, material);

	core.name = 'Enemy-core';

	let [cabX, cabY, cabZ] = [6, 2, 8];

	const cabinShape = new Shape();
	cabinShape.moveTo(0, 0).lineTo(cabX, 0).lineTo(cabX, cabZ).lineTo(0, cabZ).closePath;
	const cabinGeo = new ExtrudeGeometry(cabinShape, {
		depth: 1,
		bevelEnabled: true,
		bevelSize: 1,
		bevelThickness: 2,
	});

	// const cabinGeo = new BoxGeometry(cabX,cabY,cabZ);
	const cabin = new Mesh(cabinGeo, material);
	cabin.name = 'Enemy-cabin';
	cabin.rotateX(Math.PI / 2);
	cabin.translateX(-cabX / 2);
	cabin.translateY(-5);
	cabin.translateZ(-cabX / 2);

	const wheelCoords = wheelPositions(5);
	Object.values(wheelCoords).forEach(coors => {
		const wheelMat = new MeshToonMaterial({ color: 0x343434 });
		const wheelGeo = new CylinderGeometry(4, 4, 2);
		const wheel = new Mesh(wheelGeo, wheelMat);
		wheel.name = 'Enemy-wheel';

		const wheelCenterMat = new MeshToonMaterial({ color: 0xcdcdcd });
		const wheelCenterGeo = new CylinderGeometry(2, 2, 3);
		const wheelCenter = new Mesh(wheelCenterGeo, wheelCenterMat);
		wheelCenter.name = 'Enemy-wheel-center';

		wheel.rotateX(Math.PI / 2);
		wheel.rotateZ(Math.PI / 2);

		wheelCenter.rotateX(Math.PI / 2);
		wheelCenter.rotateZ(Math.PI / 2);
		enemy.add(wheel);
		enemy.add(wheelCenter);

		wheel.position.set(coors.x, 0, coors.y);
		wheelCenter.position.set(coors.x, 0, coors.y);
	});

	const headLightGeo = new CylinderGeometry(0.8, 1, 0.2);
	const headLightMat = new MeshToonMaterial({ color: 0xffffff });

	const headLight1 = new Mesh(headLightGeo, headLightMat);
	const headLight2 = new Mesh(headLightGeo, headLightMat);
	enemy.add(headLight1);
	enemy.add(headLight2);
	headLight1.rotateX(Math.PI / 2);
	headLight2.rotateX(Math.PI / 2);

	const headPos = {
		left: { x: cabX / 2 - 1.2, y: 0.4, z: 6.5 },
		right: { x: -cabX / 2 + 1.2, y: 0.4, z: 6.5 },
	};
	headLight1.position.set(headPos.left.x, headPos.left.y, headPos.left.z);
	headLight2.position.set(headPos.right.x, headPos.right.y, headPos.right.z);

	enemy.add(core);
	enemy.add(cabin);
}
