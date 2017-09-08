
const PI2 = Math.PI * 2;

function normalizeAngle(a) {
	return a - Math.floor(a / PI2) * PI2;
}

function getArcPoints(startAngle, endAngle, radius) {
	if (endAngle < startAngle) endAngle += PI2;
	let deltaAngle = 0.3 / radius;
	if ((endAngle - startAngle) / deltaAngle < 4)
		deltaAngle = (endAngle - startAngle) / 4;
	let points = [];
	let a;
	for (a = startAngle; a < endAngle; a += deltaAngle)
		points.push([Math.cos(a) * radius, Math.sin(a) * radius]);
	if (Math.abs(a - endAngle) > 0.001)
		points.push([Math.cos(endAngle) * radius, Math.sin(endAngle) * radius]);
	return points;
}

export function arc(g, cx, cy, r, startAngle, endAngle, counterClockwise, moveToStart=true) {
	startAngle = normalizeAngle(startAngle);
	endAngle = normalizeAngle(endAngle);

	let points;
	if (counterClockwise)
		points = getArcPoints(endAngle, startAngle, r);
	else
		points = getArcPoints(startAngle, endAngle, r);

	for (let i = 0; i < points.length; i++) {
		if (i === 0 && moveToStart)
			g.moveTo(cx + points[i][0], cy + points[i][1]);
		else
			g.lineTo(cx + points[i][0], cy + points[i][1]);
	}
}

export function donut(g, cx, cy, ir, or, startAngle, endAngle, counterClockwise) {
  if (ir < 0.001) return arc(g, cx, cy, or, startAngle, endAngle, counterClockwise);

	startAngle = normalizeAngle(startAngle);
	endAngle = normalizeAngle(endAngle);

	let points;
	if (counterClockwise)
		points = getArcPoints(endAngle, startAngle, or);
	else
		points = getArcPoints(startAngle, endAngle, or);

  if (points.length == 0) return;

	for (let i = 0; i < points.length; i++) {
		if (i === 0)
			g.moveTo(cx + points[i][0], cy + points[i][1]);
		else
			g.lineTo(cx + points[i][0], cy + points[i][1]);
	}

  let rRatio = ir / or;

  for (let i = points.length - 1; i >= 0; i--) {
			g.lineTo(cx + rRatio * points[i][0], cy + rRatio * points[i][1]);
  }

	g.lineTo(cx + points[0][0], cy + points[0][1]);
}


