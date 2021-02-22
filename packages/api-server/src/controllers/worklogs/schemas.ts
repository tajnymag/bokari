import { WorkLog } from '@bokari/entities';
import { Exclude, Expose, Type } from "class-transformer";
import { IsDate, IsDateString, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

import { ContractJoinable } from '../contracts';
import { UserJoinable } from '../users';

@Exclude()
export class WorkLogsQueryParams implements Partial<WorkLog> {
  @Expose()
	@IsOptional()
	@IsString()
	'contract.code'?: string;

  @Expose()
	@IsOptional()
	@IsInt()
	'contract.id'?: number;

  @Expose()
	@IsOptional()
	@IsString()
	'user.username'?: string;

  @Expose()
	@IsOptional()
	@IsInt()
	'user.id'?: number;

  @Expose()
	@Type(() => Date)
	@IsOptional()
	@IsDate()
	from?: Date;

  @Expose()
	@Type(() => Date)
	@IsOptional()
	@IsDate()
	to?: Date;
}

@Exclude()
export class WorkLogInsertable {
  @Expose()
	@Type(() => Date)
	@IsDate()
	from!: Date;

  @Expose()
	@Type(() => Date)
	@IsDate()
	to!: Date;

  @Expose()
	@IsOptional()
	@IsString()
	description?: string;

  @Expose()
	@Type(() => UserJoinable)
	@ValidateNested()
	user!: UserJoinable;

  @Expose()
	@Type(() => ContractJoinable)
	@IsOptional()
	@ValidateNested()
	contract?: ContractJoinable;
}
