import { Entity } from './entity';

/**
 * @tsoaModel
 */
export interface Address extends Entity {
	city: string;
	street: string;
	state?: string;
	zip: string;
	country: string;
}
