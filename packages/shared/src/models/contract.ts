import { Override } from '../helpers';
import { Client } from './client';
import { User } from './user';
import { MonetaryValue } from './monetary-value';
import { Entity, Linkable } from './entity';
import { File } from './file';
import { Level } from './level';
import { Subcontract } from './subcontract';
import { Comment } from './comment';

/**
 * @tsoaModel
 */
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

export type ContractInsertable = Override<
	Contract,
	{
		client: Linkable<Client>;
		responsibleUser: Linkable<User>;
		levels: Linkable<Level>[];
		subcontracts: Linkable<Subcontract>[];
	}
>;
