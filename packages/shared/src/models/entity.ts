import { SetRequired } from '../helpers';

export interface Entity {
	id?: number;
}

export type Linkable<T extends Entity> = Partial<T> & SetRequired<T, 'id'>;
