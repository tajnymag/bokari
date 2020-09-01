import { Entity } from './entity';

export interface MonetaryValue extends Entity {
	amount: number;
	createdAt: Date;
	currency: string;
}
