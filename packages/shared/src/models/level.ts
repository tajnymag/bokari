import {Entity} from "./entity";

export interface Level extends Entity {
	name: string;
	startAt: Date;
	deadlineAt: Date;
	isDone: boolean;
}
