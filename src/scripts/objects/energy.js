import GameObject from './gameObject';
import {S} from '../const';

export default class Energy extends GameObject {
	constructor(obj) {
		super(obj);

		this.g = new PIXI.Graphics();
	}

	update(dobj, room) {
		let obj = super.update(dobj, room);

		let g = this.g;

		const e = obj.energy;
		// this produces a number between 0 and 1, approaching 1 as e approaches infinity
		const scale = e / (e + 100);

		g.beginFill(0xffff00);
		g.drawCircle(S(5), S(5), Math.min(S(5), Math.max(1, S(4) * scale)));
		g.endFill();
	}
}
