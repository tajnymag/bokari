export function dedupe<T>(array: T[]): T[] {
	return [...new Set(array)];
}

export function isEmptyObject(value: unknown): boolean {
	return typeof value === 'object' && value !== null && Object.keys(value).length === 0;
}
