import { Override } from '../helpers';
import { Person } from './person';
import { Business } from './business';
import { Entity, Linkable } from './entity';

/**
 * @tsoaModel
 */
export interface Contractor extends Person, Entity {
	business: Business;
}

export type ContractorInsertable = Override<Contractor, { business: Linkable<Business> }>;
