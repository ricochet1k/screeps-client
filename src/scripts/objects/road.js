import GameObject from './gameObject';
import {S} from '../const';

const ALL_DIRECTIONS = [
	[0, -1],
	[1, -1],
	[1, 0],
	[1, 1],
	[0, 1],
	[-1, 1],
	[-1, 0],
	[-1, -1],
]

export default class Road extends GameObject {
	constructor(obj) {
		super(obj);

		this.g = new PIXI.Graphics();
		this.dirty = false;
	}

	update(dobj, room) {
		let obj = super.update(dobj, room);

		// console.log('road update', obj.x, obj.y, dobj);


		this.dirty = true;

	}

	preRender(timestamp, room) {
		super.preRender(timestamp, room);

		if (this.dirty) {
			this.dirty = false;

			let g = this.g;

			let sin45 = Math.sin(Math.PI / 4);

			let m = S(5);
			let r = S(1.5);
			let rb = r * sin45;
			let l = S(10);
			let lb = l; // / sin45;

			g.clear();
			g.beginFill(0x888888);
			g.drawCircle(m, m, r);
			g.endFill();


			let grid = room.layers['road'].grid;
			let {x, y} = this.obj;

			// console.log('road', x, y, grid, this);

			if (grid.get(x-1, y-1)) {
				// console.log('road tl');
				g.beginFill(0x888888);
				g.moveTo(m+rb, m-rb);
				g.lineTo(m-rb, m+rb);
				g.lineTo(m-rb-lb, m+rb-lb);
				g.lineTo(m+rb-lb, m-rb-lb);
				g.lineTo(m+rb, m-rb);
				g.endFill();
			}

			if (grid.get(x, y-1)) {
				// console.log('road t');
				g.beginFill(0x888888);
				g.moveTo(m+r, m);
				g.lineTo(m-r, m);
				g.lineTo(m-r, m-l);
				g.lineTo(m+r, m-l);
				g.lineTo(m+r, m);
				g.endFill();
			}

			if (grid.get(x+1, y-1)) {
				// console.log('road tl');
				g.beginFill(0x888888);
				g.moveTo(m-rb, m-rb);
				g.lineTo(m+rb, m+rb);
				g.lineTo(m+rb+lb, m+rb-lb);
				g.lineTo(m-rb+lb, m-rb-lb);
				g.lineTo(m-rb, m-rb);
				g.endFill();
			}

			if (grid.get(x-1, y)) {
				// console.log('road t');
				g.beginFill(0x888888);
				g.moveTo(m, m+r);
				g.lineTo(m, m-r);
				g.lineTo(m-l, m-r);
				g.lineTo(m-l, m+r);
				g.lineTo(m, m+r);
				g.endFill();
			}

		}
	}
}
