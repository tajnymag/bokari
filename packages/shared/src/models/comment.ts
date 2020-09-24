import { User } from './user';
import { Entity } from './entity';

/**
 * @tsoaModel
 */
export interface Comment extends Entity {
	content: string;
	createdAt: Date;
	updatedAt: Date;
	author: User;
}
