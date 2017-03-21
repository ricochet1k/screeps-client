import GameObject from './gameObject';
import {S} from '../const';

export default class Unknown extends GameObject {
	constructor(obj) {
		super(obj);
		this.g = new PIXI.Graphics();
	}

	update(dobj, room) {
		let obj = super.update(dobj, room);

		let g = this.g;

		g.clear();
		g.lineStyle(2, 0xff0000, 1);
		g.moveTo(S(0), S(0));
		g.lineTo(S(10), S(10));

		g.moveTo(S(10), S(0));
		g.lineTo(S(0), S(10));
	}
}
