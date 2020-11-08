import { Override } from '../helpers';
import { Contract } from './contract';
import { Contractor } from './contractor';
import { Linkable } from './entity';

/**
 * @tsoaModel
 */
export interface Subcontract extends Omit<Contract, 'code' | 'responsibleUser' | 'client'> {
	contractor: Contractor;
}

export type SubcontractInsertable = Override<Subcontract, { contractor: Linkable<Contractor> }>;
