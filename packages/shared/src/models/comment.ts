import { Override } from '../helpers';
import { User } from './user';
import { Entity, Linkable } from './entity';

/**
 * @tsoaModel
 */
export interface Comment extends Entity {
	content: string;
	createdAt: Date;
	updatedAt: Date;
	author: User;
}

export type CommentInsertable = Override<Comment, { author: Linkable<User> }>;
