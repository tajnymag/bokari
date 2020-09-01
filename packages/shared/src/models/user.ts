import { Contact } from './contact';
import { Person } from './person';
import { Entity } from './entity';
import { Permission } from './permission';
import { MonetaryValue } from './monetary-value';

export interface User extends Person, Entity {
	username: string;
	password?: string;
	contacts: Contact[];
	permissions: Permission[];
	wage?: MonetaryValue;
}

export type UserInsertable = Pick<
	Required<User>,
	'name' | 'username' | 'password' | 'permissions' | 'wage'
>;
