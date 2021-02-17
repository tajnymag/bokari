import { Expose, Type } from 'class-transformer';
import { IsInt, ValidateNested } from 'class-validator';
import { PersonInsertable } from '../people';

@Expose()
export class CustomerJoinable {
	@IsInt()
	id!: number;
}

@Expose()
export class CustomerInsertable {
	@Type(() => PersonInsertable)
	@ValidateNested()
	person!: PersonInsertable;
}
