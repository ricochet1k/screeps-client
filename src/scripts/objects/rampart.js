import GameObject from './gameObject';
import {S} from '../const';
import {clampXYf, neighbors, renderSquare} from '../terrain';

export default class Rampart extends GameObject {
	constructor(obj) {
		super(obj);

		this.g = new PIXI.Graphics();
		this.dirty = false;
	}

	update(dobj, room) {
		let obj = super.update(dobj, room);
		this.dirty = true;
	}

	preRender(timestamp, room) {
		super.preRender(timestamp, room);

		if (this.dirty) {
			this.dirty = false;

			let obj = this.obj;
			let g = this.g;

			g.clear();
			let ns = neighbors(obj.x, obj.y, clampXYf((x, y) => 
				!!room.layers['rampart'].grid.get(x, y)));
			// console.log('rampart', obj, ns);
			renderSquare(g, 0, 0, ns, 0x446688);
			// g.lineStyle(1, 0xffffff, 1);
			// // g.drawCircle(S(5), S(5), S(5));

			// g.beginFill(0x446688);
			// g.drawCircle(S(5), S(5), S(6));
			// g.endFill();
			
		}
	}
}
