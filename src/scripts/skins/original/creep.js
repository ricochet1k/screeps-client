
import {S, SQUARE_SIZE, TWEEN_DURATION} from '../../const';
import {tween, tweenRotation, interp} from '../../tween';
import {actionLine, bump} from '../../actions';

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
					// actionLine(room, k, a, {x: obj.x, y: obj.y});
					break;

				case 'rangedAttack':
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

		let m = S(5); // middle
		let pw = S(2); // part width/thickness
		let pr = S(5);  // part outer radius

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

		g.lineStyle(0, 0, 0);
		g.beginFill(0xffff00);
		g.drawCircle(S(5), S(5), S(2.5) * obj.energy / obj.energyCapacity);
		g.endFill();

		tweenRotation(TWEEN_DURATION/2, g, this.creep.lastObj, obj);
	}

	preRender(timestamp) {

	}
}

