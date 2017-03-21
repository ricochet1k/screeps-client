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

		g.beginFill(0xffff00);
		g.drawCircle(S(5), S(5), S(4) * obj.energy / 1000);
		g.endFill();
	}
}
