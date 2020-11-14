import { SetRequired } from '../helpers';
import { Contact } from './contact';
import { Person } from './person';
import { Entity } from './entity';
import { Permission } from './permission';
import { MonetaryValue } from './monetary-value';
import { Group } from './group';

/**
 * @tsoaModel
 */
export interface User extends Person, Entity {
	username: string;
	password?: string;
	contacts?: Contact[];
	groups?: Group['name'][];
	permissions?: Permission[];
	wage?: MonetaryValue;
}

export type UserInsertable = SetRequired<User, 'username' | 'password' | 'groups'>;
