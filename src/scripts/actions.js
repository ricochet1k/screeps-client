import {SQUARE_SIZE, TWEEN_DURATION} from './const';
import {tween, tweenRotation, interp} from './tween';

export function actionLine(room, action, from, to) {
	let g = new PIXI.Graphics();
	room.g.addChild(g);

	const color = 0xffff00;

	const fx = (from.x + 0.5) * SQUARE_SIZE;
	const fy = (from.y + 0.5) * SQUARE_SIZE;
	const tx = (to.x + 0.5) * SQUARE_SIZE;
	const ty = (to.y + 0.5) * SQUARE_SIZE;

	// console.log('actionLine', fx, fy, tx, ty);

	tween(TWEEN_DURATION, {}, v => {
		if (v === 1) {
			room.g.removeChild(g);
			return;
		}

		g.clear();
		g.lineStyle(3, color, 1);

		if (v < 0.5) {
			v = v * 2;
			g.moveTo(fx, fy);
			g.lineTo(interp(fx, tx, v), interp(fy, ty, v));
		} else {
			v = (v - 0.5) * 2;
			g.moveTo(fx + (tx-fx)*v, fy + (ty-fy)*v);
			g.lineTo(tx, ty);
		}
	});
}

export function bump(g, gRot, obj, a) {
	let {x, y} = obj;
	tweenRotation(TWEEN_DURATION/2, gRot, obj, a);
	tween(TWEEN_DURATION, g, v => {
		if (v < 0.5) {
			v = v;
		} else {
			v = (1 - v);
		}
		g.x = SQUARE_SIZE * interp(x, a.x, v);
		g.y = SQUARE_SIZE * interp(y, a.y, v);
	});
}