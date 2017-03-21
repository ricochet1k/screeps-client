
export const SQUARE_SIZE = 20;
// export const SQUARE_MIDDLE = SQUARE_SIZE / 2;

export const TWEEN_DURATION = 500; // milliseconds

// easy square size scaling. size between 0 and 10 to SQUARE_SIZE
export function S(n) {
	return SQUARE_SIZE * n / 10;
}