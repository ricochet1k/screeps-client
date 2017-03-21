
import {S, SQUARE_SIZE} from './const';

export function renderTerrain(g, terrain) {
	let ground = new PIXI.Graphics();
	ground.beginFill(0x444444);
	ground.drawRect(0, 0, 50*SQUARE_SIZE, 50*SQUARE_SIZE);
	ground.endFill();
	g.addChild(ground);

	let swamp = new PIXI.Graphics();
	swamp.clear();
	g.addChild(swamp);

	let walls = new PIXI.Graphics();
	walls.clear();
	g.addChild(walls);

    for (let x = 0; x < 50; x++) {
      for (let y = 0; y < 50; y++) {
        let color;
        let t = +terrain[y * 50 + x];
        if (t === 0) { // ground
	        // g.beginFill(0x444444);
	        // g.drawRect(x * SQUARE_SIZE, y * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE);
	        // g.endFill();
	        continue;
        }

        let ns = neighbors(x, y, clampXYf((x, y) => +terrain[x + y*50]));

        if (t & 2) { // swamp
        	renderSquare(swamp, x, y, ns.map(n => n&2), 0x116600);
        }
        if (t & 1) { // wall
        	renderSquare(walls, x, y, ns.map(n => n&1), 0x000000);
        }
        // switch (t) {
        //   case 0: // ground
        //     color = 0x444444;
        //     break;
        //   case 3: // swamp + wall
        //   case 1: // wall
        //     color = 0x000000;
        //     break;
        //   case 2: // swamp
        //     color = 0x008800;
        //     break;
        //   default:
        //     console.log("unknown terrain: ", x, y, terrain[y*50 + x]);
        //     color = 0xff0000;
        // }
      }
    }

    g.cacheAsBitmap = true;
}

export function clampXYf(f) {
	return function(x, y) {
		return f(Math.max(0, Math.min(49, x)), Math.max(0, Math.min(49, y)));
	}
}

export function neighbors(x, y, f) {
	let ns = [];
	ns.push(f(x-1, y-1));
	ns.push(f(x, y-1));
	ns.push(f(x+1, y-1));

	ns.push(f(x-1, y));
	ns.push(f(x+1, y));

	ns.push(f(x-1, y+1));
	ns.push(f(x, y+1));
	ns.push(f(x+1, y+1));
	return ns;
}

export function renderSquare(g, x, y, ns, color) {
	g.beginFill(color);

	let xs = x * SQUARE_SIZE;
	let ys = y * SQUARE_SIZE;

	let R = S(4);
	let s = SQUARE_SIZE;

	let tl = ns[0];
	let t = ns[1];
	let tr = ns[2];
	let l = ns[3];
	let r = ns[4];
	let bl = ns[5];
	let b = ns[6];
	let br = ns[7];

	g.moveTo(xs + 0, ys + R);

	// top left corner
	if (!l && !tl && !t) {
		g.arcTo(xs + 0, ys + 0, xs + R, ys + 0, R);
	} else if (t && l && !tl) {
		g.lineTo(xs + -R, ys + 0);
		g.arcTo(xs + 0, ys + 0, xs + 0, ys + -R, R);
	} else {
		g.lineTo(xs + 0, ys + 0);
	}

	// top right corner
	if (!r && !tr && !t) {
		g.arcTo(xs + s, ys + 0, xs + s, ys + R, R);
	} else if (t && r && !tr) {
		g.lineTo(xs + s, ys + -R);
		g.arcTo(xs + s, ys + 0, xs + s + R, ys + 0, R);
	} else {
		g.lineTo(xs + s, ys + 0);
	}

	// bottom right corner
	if (!r && !br && !b) {
		g.arcTo(xs + s, ys + s, xs + R, ys + s, R);
	} else if (b && r && !br) {
		g.lineTo(xs + s + R, ys + s);
		g.arcTo(xs + s, ys + s, xs + s, ys + s + R, R);
	} else {
		g.lineTo(xs + s, ys + s);
	}

	// bottom left corner
	if (!l && !bl && !b) {
		g.arcTo(xs + 0, ys + s, xs + 0, ys + s-R, R);
	} else if (b && l && !bl) {
		g.lineTo(xs + 0, ys + s+R);
		g.arcTo(xs + 0, ys + s, xs + 0 - R, ys + s, R);
	} else {
		g.lineTo(xs + 0, ys + s);
	}

	g.closePath();

	g.endFill();
}
