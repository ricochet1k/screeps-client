
import {SQUARE_SIZE, TWEEN_DURATION} from '../const';
import {tween} from '../tween';


let firstTween;

let updateKeys = {};

export default class GameObject {
	constructor(obj) {
		this.obj = obj;
		this.lastObj = null;
	}

	update(dobj) {
		if (!this.lastObj) {
			this.g.x = dobj.x * SQUARE_SIZE;
			this.g.y = dobj.y * SQUARE_SIZE;
			this.lastObj = {};
		}

		let last = this.lastObj;
		let obj = this.obj;
		for (var k in obj) {
			last[k] = obj[k];
		}
		for (var k in dobj) {
			if (!updateKeys[k]) {
				// console.log("updateKey", obj.type, k, dobj[k]);
				updateKeys[k] = true;
			}
			obj[k] = dobj[k];
		}
		if ("x" in dobj) {
			tween(TWEEN_DURATION, this, v => this.g.x = v * SQUARE_SIZE, 
				last.x, obj.x);
		}
		if ("y" in dobj) {
			tween(TWEEN_DURATION, this, v => this.g.y = v * SQUARE_SIZE, 
				last.y, obj.y);
		}

		return obj;
	}

	preRender(timestamp) {
		if (!this.lastObj) return;
	}
}