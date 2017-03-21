
import {S, SQUARE_SIZE, TWEEN_DURATION} from '../../const';
import {tween, interp} from '../../tween';

export class CreepSkin {
	constructor(creep) {
		this.creep = creep;

		this.g = new PIXI.Container();
		this.graphics = new PIXI.Graphics();
		this.graphics.position.set(S(5), S(5));
		this.graphics.pivot.set(S(5), S(5));
		this.g.addChild(this.graphics);

		if (creep.obj.spawning)
			this.graphics.visible = false;
	}

	update(dobj, room) {
		let obj = this.creep.obj;
		let g = this.graphics;

		if (obj.spawning) {
			g.visible = false;
			return;
		} else {
			g.visible = true;
		}

		for (let k in obj.actionLog) {
			let a = obj.actionLog[k];
			if (!a) continue;

			switch (k) {
				case 'harvest':
					let {x, y} = this.creep.obj;
					this.rotation(g, obj, a);
					tween(TWEEN_DURATION, this, v => {
						if (v < 0.5) {
							v = v;
						} else {
							v = (1 - v);
						}
						this.g.x = SQUARE_SIZE * interp(x, a.x, v);
						this.g.y = SQUARE_SIZE * interp(y, a.y, v);
					});
					break;

				case 'say':
					break;

				case 'repair':
				case 'build':
				case 'upgradeController':
					actionLine(room, k, {x: obj.x, y: obj.y}, a);
					break;

				default:
					console.log("actionLog", k, a, this);
			}
		}

		g.clear();
		g.beginFill(0x222222);
		g.drawCircle(S(5), S(5), S(5));
		g.endFill();

		let bodyCount = {};
		for (let i = 0; i < obj.body.length; i++) {
			let part = obj.body[i];
			bodyCount[part.type] = (bodyCount[part.type]||0) + 1;
		}

		let m = S(5);
		let pw = S(2);
		let pr = S(5);

		const tau = Math.PI * 2;
		const halfPartWidth = (tau / 50) / 2;

		g.lineStyle(0, 0, 0);
		
		g.beginFill(0x8888ff);
		const moveAL = (bodyCount.move || 0) * halfPartWidth;
		g.arc(m, m, pr, tau / 2 - moveAL, tau / 2 + moveAL, false);
		g.arc(m, m, pr-pw, tau / 2 + moveAL, tau / 2 - moveAL, true);
		g.endFill();

		g.beginFill(0xffff00);
		const workAL = (bodyCount.work || 0) * halfPartWidth;
		g.arc(m, m, pr, -workAL, +workAL, false);
		g.arc(m, m, pr-pw, +workAL, -workAL, true);
		g.endFill();

		g.beginFill(0xffff00);
		g.drawCircle(S(5), S(5), S(2.5) * obj.energy / obj.energyCapacity);
		g.endFill();

		this.rotation(g, this.creep.lastObj, obj);
	}

	rotation(g, from, to) {
		if (from.x !== to.x || from.y !== to.y) {
			let oldRot = g.rotation;
			let newRot = Math.atan2(to.y - from.y, to.x - from.x);
			let diff = Math.abs(oldRot - newRot);
			if (diff > Math.PI) {
				// console.log('large rot', diff, oldRot, newRot);
				const PI = Math.PI;
				const PI2 = PI * 2;
				if (oldRot < 0) oldRot += PI2;
				else oldRot -= PI2;
				let diff2 = Math.abs(oldRot - newRot);
				// console.log('large rot2', diff2, oldRot, newRot);
			}
			if (oldRot !== newRot) {
				tween(TWEEN_DURATION/2, this, v => g.rotation = v,
					oldRot, newRot);
			}
		}
	}

	preRender(timestamp) {

	}
}

function actionLine(room, action, from, to) {
	let g = new PIXI.Graphics();
	room.g.addChild(g);

	let fx = (from.x + 0.5) * SQUARE_SIZE;
	let fy = (from.y + 0.5) * SQUARE_SIZE;
	let tx = (to.x + 0.5) * SQUARE_SIZE;
	let ty = (to.y + 0.5) * SQUARE_SIZE;

	// console.log('actionLine', fx, fy, tx, ty);

	tween(TWEEN_DURATION, {}, v => {
		if (v === 1) {
			room.g.removeChild(g);
			return;
		}

		g.clear();
		g.lineStyle(3, 0xffff00, 1);

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
