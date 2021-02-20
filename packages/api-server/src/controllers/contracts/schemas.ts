import {
	IsBoolean, IsDate, IsIn,
	IsInt, IsNotEmpty,
	IsOptional,
	IsString, Min,
	ValidateNested
} from 'class-validator';
import { Exclude, Expose, Type } from "class-transformer";

import { CustomerJoinable } from '../customers';
import { Monetary } from '@bokari/entities';

@Expose()
export class ContractsQueryParams {
	@IsOptional()
	@IsInt()
	limit?: number;

	@IsOptional()
	@IsInt()
	@Min(1)
	page?: number;

	@IsOptional()
	@IsString()
	search?: string;
}

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

	@Type(() => Monetary)
	@ValidateNested()
	price!: Monetary;
}

@Exclude()
export class ContractUpdatable {
  @Expose()
	@IsOptional()
	code?: string;

  @Expose()
	@IsOptional()
	name?: string;

  @Expose()
	@Type(() => Date)
	@IsOptional()
	startAt?: Date;

  @Expose()
	@Type(() => Date)
	@IsOptional()
	deadlineAt?: Date;

  @Expose()
	@Type(() => CustomerJoinable)
	@IsOptional()
	customer?: CustomerJoinable;

  @Expose()
	@Type(() => Monetary)
	@IsOptional()
	price?: Monetary;
}
