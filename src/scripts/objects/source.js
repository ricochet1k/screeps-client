import GameObject from './gameObject';
import {S} from '../const';

export default class Source extends GameObject {
	constructor(obj) {
		super(obj);

		this.g = new PIXI.Graphics();
	}

	update(dobj, room) {
		let obj = super.update(dobj, room);

		let g = this.g;

		g.clear();
		g.lineStyle(1, 0xffffff, 1);
		g.drawCircle(S(5), S(5), S(5));

		g.beginFill(0xffff00);
		g.drawCircle(S(5), S(5), S(5) * Math.ceil(obj.energy / obj.energyCapacity));
		g.endFill();
	}
}
