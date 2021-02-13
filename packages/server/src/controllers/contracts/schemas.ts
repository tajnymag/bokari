import {
	IsBoolean, IsDate,
	IsDateString,
	IsInt,
	IsOptional,
	IsString,
	ValidateNested
} from 'class-validator';
import { Expose, Type } from 'class-transformer';

import { MonetaryInsertable } from '../schemas';
import { CustomerJoinable } from '../customers';

@Expose()
export class ContractJoinable {
	@IsInt()
	id!: number;
}

@Expose()
export class ContractInsertable {
	@IsOptional()
	@IsString()
	code?: string;

	@IsOptional()
	@IsString()
	name!: string;

	@Type(() => CustomerJoinable)
	@ValidateNested()
	customer!: CustomerJoinable;

	@Type(() => Date)
	@IsDate()
	startAt!: Date;

	@Type(() => Date)
	@IsDate()
	deadlineAt!: Date;

	@IsOptional()
	@IsString()
	description?: string;

	@IsOptional()
	@IsBoolean()
	isDone?: boolean;

	@Type(() => MonetaryInsertable)
	@ValidateNested()
	price!: MonetaryInsertable;
}

@Expose()
export class ContractUpdatable {
	@IsOptional()
	code?: string;

	@IsOptional()
	name?: string;

	@Type(() => Date)
	@IsOptional()
	startAt?: Date;

	@Type(() => Date)
	@IsOptional()
	deadlineAt?: Date;

	@Type(() => CustomerJoinable)
	@IsOptional()
	customer?: CustomerJoinable;

	@Type(() => MonetaryInsertable)
	@IsOptional()
	price?: MonetaryInsertable;
}
