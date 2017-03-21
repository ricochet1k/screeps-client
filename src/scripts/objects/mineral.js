import GameObject from './gameObject';
import {S} from '../const';

export default class Mineral extends GameObject {
	constructor(obj) {
		super(obj);

		this.g = new PIXI.Graphics();
	}

	update(dobj, room) {
		let obj = super.update(dobj, room);

		let g = this.g;

		g.beginFill(0x0000ff);
		g.drawCircle(S(5), S(5), S(4));
		g.endFill();
	}
}
