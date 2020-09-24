import { Entity } from './entity';

/**
 * @tsoaModel
 */
export interface MonetaryValue extends Entity {
	amount: number;
	createdAt: Date;
	currency: string;
}
