import { WorkLog } from '@bokari/entities';
import { Expose, Type } from 'class-transformer';
import { IsDate, IsDateString, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

import { ContractJoinable } from '../contracts';
import { UserJoinable } from '../users';

export class WorkLogsQueryParams implements Partial<WorkLog> {
	@IsOptional()
	@IsString()
	'contract.code'?: string;

	@IsOptional()
	@IsInt()
	'contract.id'?: number;

	@IsOptional()
	@IsString()
	'user.username'?: string;

	@IsOptional()
	@IsInt()
	'user.id'?: number;

	@Type(() => Date)
	@IsOptional()
	@IsDate()
	from?: Date;

	@Type(() => Date)
	@IsOptional()
	@IsDate()
	to?: Date;
}

@Expose()
export class WorkLogInsertable {
	@Type(() => Date)
	@IsDate()
	from!: Date;

	@Type(() => Date)
	@IsDate()
	to!: Date;

	@IsOptional()
	@IsString()
	description?: string;

	@Type(() => UserJoinable)
	@ValidateNested()
	user!: UserJoinable;

	@Type(() => ContractJoinable)
	@IsOptional()
	@ValidateNested()
	contract?: ContractJoinable;
}
