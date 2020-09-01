import { Client } from './client';
import { User } from './user';
import { MonetaryValue } from './monetary-value';
import { Entity } from './entity';
import { File } from './file';
import { Level } from './level';
import { Subcontract } from './subcontract';

export interface Contract extends Entity {
	code: string;
	startAt: Date;
	deadlineAt: Date;
	name: string;
	description?: string;
	isDone: boolean;
	client: Client;
	responsibleUser: User;
	comments: Comment[];
	files: File[];
	price: MonetaryValue;
	levels: Level[];
	subcontracts: Subcontract[];
}
