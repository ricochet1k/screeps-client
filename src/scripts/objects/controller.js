import GameObject from './gameObject';
import {S} from '../const';

export default class Controller extends GameObject {
	constructor(obj) {
		super(obj);
		this.g = new PIXI.Graphics();
	}

	update(dobj, room) {
		let obj = super.update(dobj, room);

		let g = this.g;

		g.clear();
		g.lineStyle(2, 0xffffff, 1);
		g.drawCircle(S(5), S(5), S(7));
	}
}
