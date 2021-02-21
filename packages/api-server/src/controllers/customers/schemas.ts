import { Exclude, Expose, Type } from 'class-transformer';
import { IsInt, ValidateNested } from 'class-validator';

import { PersonInsertable } from '../people';

@Exclude()
export class CustomerJoinable {
	@Expose()
	@IsInt()
	id!: number;
}

@Exclude()
export class CustomerInsertable {
	@Expose()
	@Type(() => PersonInsertable)
	@ValidateNested()
	person!: PersonInsertable;
}
