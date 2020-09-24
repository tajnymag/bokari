import { Contract } from './contract';
import { Contractor } from './contractor';

/**
 * @tsoaModel
 */
export interface Subcontract extends Omit<Contract, 'code' | 'responsibleUser' | 'client'> {
	contractor: Contractor;
}
