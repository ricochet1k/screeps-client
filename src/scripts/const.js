
export const SQUARE_SIZE = 20;
// export const SQUARE_MIDDLE = SQUARE_SIZE / 2;

export const TWEEN_DURATION = 500; // milliseconds

// easy square size scaling. size between 0 and 10 to SQUARE_SIZE
export function S(n) {
	return Sf(n); //Math.round(Sf(n))+0.5;
}

// Same as above but doesn't round to pixel widths... can be fuzzy
export function Sf(n) {
	return SQUARE_SIZE * n / 10;
}