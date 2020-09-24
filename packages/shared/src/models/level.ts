import { Entity } from './entity';

/**
 * @tsoaModel
 */
export interface Level extends Entity {
	name: string;
	startAt: Date;
	deadlineAt: Date;
	isDone: boolean;
}
