/* eslint-disable @typescript-eslint/no-empty-function */
function NoOpDecorator(...args: unknown[]) {
	return (...args: unknown[]): void => {};
}

export type DeepPartial<T> = {
	[P in keyof T]?: T[P] extends Array<infer U>
		? Array<DeepPartial<U>>
		: T[P] extends ReadonlyArray<infer U>
		? ReadonlyArray<DeepPartial<U>>
		: DeepPartial<T[P]> | T[P];
};

export {
	NoOpDecorator as Column,
	NoOpDecorator as CreateDateColumn,
	NoOpDecorator as DeleteDateColumn,
	NoOpDecorator as Entity,
	NoOpDecorator as Index,
	NoOpDecorator as JoinColumn,
	NoOpDecorator as JoinTable,
	NoOpDecorator as ManyToMany,
	NoOpDecorator as ManyToOne,
	NoOpDecorator as OneToMany,
	NoOpDecorator as OneToOne,
	NoOpDecorator as PrimaryColumn,
	NoOpDecorator as PrimaryGeneratedColumn,
	NoOpDecorator as Unique,
	NoOpDecorator as UpdateDateColumn
};
