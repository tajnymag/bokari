export function dedupe<T>(array: T[]): T[] {
	return [...new Set(array)];
}

export function isEmptyObject(value: object): boolean {
	return Object.keys(value).length === 0;
}
