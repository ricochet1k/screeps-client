
import {S, SQUARE_SIZE, TWEEN_DURATION} from '../../const';
import {tween, tweenRotation, interp} from '../../tween';
import {actionLine, bump, flash, say} from '../../actions';

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
					bump(this.g, g, obj, a);
					break;

				case 'say':
					break;

				case 'repair':
				case 'build':
				case 'upgradeController':
					actionLine(room, k, {x: obj.x, y: obj.y}, a);
					break;

				case 'attacked':
					flash(this.g, 0xFF0000);
					break;
				case 'healed':
					flash(this.g, 0x00FF00);
					break;

				case 'rangedAttack':
					actionLine(room, k, {x: obj.x, y: obj.y}, a, 0x0000FF);
					break;

				case 'attack':
					bump(this.g, g, obj, a)

				default:
					console.log("actionLog", k, a, this);
			}
		}

		if(obj.actionLog && "say" in obj.actionLog) {
			obj.saying = obj.actionLog.say;
		}
		if(obj.saying) {
			say(this.g, obj.saying.message);
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

		const m = S(5); // middle
		const pw = S(2); // part width/thickness
		const pr = S(5);  // part outer radius

		const tau = Math.PI * 2;
		const pi = Math.PI;
		const halfPartWidth = (tau / 50) / 2;

		g.lineStyle(0, 0, 0);
		g.beginFill(0x8888ff);
		const moveAL = (bodyCount.move || 0) * halfPartWidth;
		g.arc(m, m, pr, pi - moveAL, pi + moveAL, false);
		g.arc(m, m, pr-pw, pi + moveAL, pi - moveAL, true);
		g.endFill();

		g.lineStyle(0, 0, 0);
		g.beginFill(0xffff00);
		const workAL = (bodyCount.work || 0) * halfPartWidth;
		g.arc(m, m, pr, -workAL, +workAL, false);
		g.arc(m, m, pr-pw, +workAL, -workAL, true);
		g.endFill();

		if(obj.energyCapacity) {
			g.lineStyle(0, 0, 0);
			g.beginFill(0xffff00);
			let e = S(2.5) * Math.sqrt(obj.energy / obj.energyCapacity);
			if (e > 0) e = Math.max(1, e);
			g.drawCircle(m, m, e);
			g.endFill();
		}

		tweenRotation(TWEEN_DURATION/2, g, this.creep.lastObj, obj);
	}

	preRender(timestamp) {

	}
}
