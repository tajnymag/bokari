import { User } from './user';
import { Entity } from './entity';

/**
 * @tsoaModel
 */
export interface File extends Entity {
	filename: string;
	url: string;
	blurHash: string;
	createdAt: Date;
	type: string;
	author: User;
}
