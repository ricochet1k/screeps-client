import GameObject from './gameObject';
import {S, TWEEN_DURATION} from '../const';
import {tween, interp} from '../tween';
import {actionLine} from '../actions';

export default class Tower extends GameObject {
	constructor(obj) {
		super(obj);
		this.g = new PIXI.Container();
		this.graphics = new PIXI.Graphics();
		this.g.addChild(this.graphics);

		this.graphics.position.set(S(5), S(5));
		this.graphics.pivot.set(S(5), S(5));

		this.freeze = 0;
	}

	update(dobj, room) {
		let obj = super.update(dobj, room);

		let g = this.graphics;

		if (dobj.actionLog) {
			for (let k in dobj.actionLog) {
				let a = dobj.actionLog[k];
				if (!a) continue;

				this.rotation(g, obj, dobj.actionLog[k]);
				this.freeze = 2;

				switch (k) {
					case 'repair':
					case 'build':
					case 'attack':
						actionLine(room, k, {x: obj.x, y: obj.y}, a);
						break;

					default:
						console.log("tower actionLog", k, a, this);
				}
			}
		}



		const m = S(5); // middle
		const r = S(7); // radius

		g.clear();
		g.lineStyle(2, 0xffffff, 1);
		g.beginFill(0x000000);
		g.drawCircle(m, m, r);
		g.endFill();

		const rr = S(1); // round radius
		const h = S(7); // body height
		const w = S(5); // body width
		const y = S(2); // body y offset

		g.lineStyle(0, 0x000000, 1);
		g.beginFill(0x888888);
		g.drawRoundedRect(m-w, y, 2*w, h, rr);
		g.endFill();

		g.lineStyle(0, 0, 0);
		g.beginFill(0xffff00);
		let height = (h-2) * obj.energy / obj.energyCapacity;
		g.drawRoundedRect(m-w+0.5, y + h - height-1, 2*w-1, height, rr);
		g.endFill();


		const tw = S(2.5); // turret width
		const th = S(7); // turret height

		g.lineStyle(1, 0x000000, 1);
		g.beginFill(0x888888);
		g.drawRoundedRect(m-tw, y-th, 2*tw, th, rr);
		g.endFill();
	}


	rotation(g, from, to) {
		if (from.x !== to.x || from.y !== to.y) {
			let oldRot = g.rotation % (Math.PI * 2);
			if (oldRot > Math.PI) oldRot = oldRot - Math.PI * 2;
			let newRot = Math.atan2(to.y - from.y, to.x - from.x) + Math.PI * 0.5;
			let diff = Math.abs(oldRot - newRot);
			if (diff > Math.PI) {
				const PI = Math.PI;
				const PI2 = PI * 2;
				if (oldRot < 0) oldRot += PI2;
				else oldRot -= PI2;
				// let diff2 = Math.abs(oldRot - newRot);
			}
			if (oldRot !== newRot) {
				tween(TWEEN_DURATION/2, this, v => g.rotation = v,
					oldRot, newRot);
			}
		}
	}

	preRender(ts) {
		super.preRender(ts);

		if (this.freeze > 0)
			this.freeze -= 0.01;
		else
			this.graphics.rotation += 0.008;
	}
}
