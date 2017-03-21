import GameObject from './gameObject';

import * as skins from '../skins';

console.log('skins', skins);

let firstCreep;

export default class Creep extends GameObject {
	constructor(obj) {
		super(obj);

		if (!firstCreep) firstCreep = this;

		let parts = this.parts = {};
		for (let i = 0; i < obj.body.length; i++) {
			let b = obj.body[i];

			parts[b.type] = (parts[b.type] || 0) + 1;
		}

		this.actions = {};


		this.skin = new (skins['original'].CreepSkin)(this);
		this.g = this.skin.g;
	}

	update(dobj, room) {
		let obj = super.update(dobj, room);

		// if (this === firstCreep)
		// 	console.log("Creep", dobj, this);
		this.skin.update(dobj, room);
	}

	preRender(ts) {
		super.preRender(ts);
		// if (this === firstCreep)
		// 	console.log("creep", this.g.x, this.g.y, this);
	}
}
