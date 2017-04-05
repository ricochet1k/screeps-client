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

		// console.log("controller", obj);

		const m = S(5);
		const A = Math.PI * 2 / 8;
		const r1 = S(8);
		const r2 = S(4);
		const o = 0.0;


		g.clear();

		for (let i = 0; i < obj.level; i++) {
			g.lineStyle(1, 0x000000, 1);
			g.beginFill(0x00ddff);
			const a = (-A/2 - Math.PI / 2) + A * i + o;
			const b = a + A - 2*o;
			g.moveTo(m+Math.cos(a)*r1, m+Math.sin(a)*r1);
			g.lineTo(m+Math.cos(b)*r1, m+Math.sin(b)*r1);
			g.lineTo(m+Math.cos(b)*r2, m+Math.sin(b)*r2);
			g.lineTo(m+Math.cos(a)*r2, m+Math.sin(a)*r2);
			g.closePath();
			g.endFill();
		}

		g.lineStyle(2, 0xffffff, 1);
		g.drawCircle(m, m, r1);
	}
}
