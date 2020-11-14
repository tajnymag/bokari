import { Entity } from './entity';
import { User } from './user';
import { Permission } from './permission';

export interface Group extends Entity {
	name: string;
	permissions: Permission[];
	users?: User[];
}
