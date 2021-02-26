/* eslint-disable @typescript-eslint/no-empty-function */
function NoOpDecorator(...args: unknown[]) {
	return (...args: unknown[]): void => {};
}

export {
	NoOpDecorator as Type,
	NoOpDecorator as Exclude,
	NoOpDecorator as Expose,
	NoOpDecorator as Transform
};
