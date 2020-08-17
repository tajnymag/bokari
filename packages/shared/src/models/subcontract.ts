import {Contract} from "./contract";
import {Contractor} from "./contractor";

export interface Subcontract extends Omit<Contract, 'code' | 'responsibleUser' | 'client'> {
	contractor: Contractor;
}
