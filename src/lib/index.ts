export const format = (x: number): string => {
	if (x > Number.MAX_SAFE_INTEGER) throw new Error('input is too large');
	if (x < Number.MIN_SAFE_INTEGER) throw new Error('input is too small');
	if (x == Number.MAX_SAFE_INTEGER) return 'inf';
	if (x == Number.MIN_SAFE_INTEGER) return '-inf';
	return x.toString();
};
