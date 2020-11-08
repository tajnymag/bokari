import { PickRequired } from '../helpers';

export interface Entity {
	id?: number;
}

export type Linkable<T extends Entity> = Partial<T> & PickRequired<T, 'id'>;
