
export default class Grid {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.array = new Array(width * height);
	}

	get(x, y) {
		if (x < 0 || x > this.width-1 || y < 0 || y > this.height-1)
			return undefined;
		return this.array[y*this.width + x];
	}

	set(x, y, val) {
		if (x < 0 || x > this.width-1 || y < 0 || y > this.height-1)
			return;
		this.array[y*this.width + x] = val;
	}
}
