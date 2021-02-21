import { EntityTarget, getRepository } from 'typeorm';

import { TypeormQuery } from './typing';

export async function existsEntity<T>(
	entity: EntityTarget<T>,
	query: TypeormQuery<T>
): Promise<boolean> {
	return (await getRepository(entity).count(query)) > 0;
}
