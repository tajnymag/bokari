import { Contract, Monetary } from '@bokari/entities';
import { Exclude, Expose, Type } from 'class-transformer';
import {
	IsBoolean,
	IsDate,
	IsIn,
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	Min,
	ValidateNested
} from 'class-validator';

import { CustomerJoinable } from '../customers';

@Exclude()
export class ContractsQueryFilterable {
	@Expose()
	@Type(() => Date)
	@IsOptional()
	@IsDate()
	deadlineAt?: Date;

	@Expose()
	@Type(() => Date)
	@IsOptional()
	@IsDate()
	startAt?: Date;
}

@Exclude()
export class ContractsQueryParams {
	@Expose()
	@IsOptional()
	@IsInt()
	limit?: number;

	@Expose()
	@IsOptional()
	@IsInt()
	@Min(1)
	page?: number;

	@Expose()
	@IsOptional()
	@IsString()
	search?: string;

	@Expose()
	@IsOptional()
	@IsString()
	@IsIn(Object.keys(new Contract()))
	orderBy?: keyof Contract;

	@Expose()
	@IsOptional()
	@IsString()
	@IsIn(['ASC', 'DESC'])
	order?: 'ASC' | 'DESC';

	@Expose()
	@IsOptional()
	@Type(() => ContractsQueryFilterable)
	@ValidateNested()
	filterMax?: ContractsQueryFilterable;

	@Expose()
	@IsOptional()
	@Type(() => ContractsQueryFilterable)
	@ValidateNested()
	filterMin?: ContractsQueryFilterable;
}

@Exclude()
export class ContractJoinable {
	@Expose()
	@IsInt()
	id!: number;
}

@Exclude()
export class ContractInsertable {
	@Expose()
	@IsOptional()
	@IsString()
	code?: string;

	@Expose()
	@IsString()
	name!: string;

	@Expose()
	@Type(() => CustomerJoinable)
	@ValidateNested()
	customer!: CustomerJoinable;

	@Expose()
	@Type(() => Date)
	@IsDate()
	startAt!: Date;

	@Expose()
	@Type(() => Date)
	@IsDate()
	deadlineAt!: Date;

	@Expose()
	@IsOptional()
	@IsString()
	description?: string;

	@Expose()
	@IsOptional()
	@IsBoolean()
	isDone?: boolean;

	@Expose()
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
