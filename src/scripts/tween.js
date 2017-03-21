

let tweenId = 0;
let tweeningObjects = {};

// tween(1000, obj, 'y', 3, 4)
// or
// tween(1000, obj, (v, o) => o.y = v, 3, 4)
export function tween(time, obj, propOrFn, from = 0, to = 1) {
	if (!obj._tween) {
		obj._tween = {tweenId: tweenId++, tweens: {}};
	}

	tweeningObjects[obj._tween.tweenId] = obj;

	let start = performance.now();
	let end = start + time;
	obj._tween.tweens[''+propOrFn] = {start, end, from, to, propOrFn};
}

export function uninterp(from, to, val) {
	let d = (val - from) / (to-from);
	return Math.max(0, Math.min(1, d));
}

export function interp(from, to, d) {
	return from + (to - from) * d;
}

tween.update = function tweenUpdate(timestamp) {
	for (let id in tweeningObjects) {
		let obj = tweeningObjects[id];
		if (!obj) continue;

		let tweens = obj._tween.tweens;
		let active = 0;
		for (let k in tweens) {
			let t = tweens[k];
			if (!t) continue;
			let {start, end, from, to, propOrFn} = t;

			let d = uninterp(start, end, timestamp);

			let v = interp(from, to, d);
			if (typeof propOrFn === "string")
				obj[propOrFn] = v;
			else
				propOrFn(v, obj);

			if (timestamp > end)
				tweens[k] = undefined;
			else
				active += 1;
		}

		if (active === 0)
			tweeningObjects[id] = undefined;
	}
}