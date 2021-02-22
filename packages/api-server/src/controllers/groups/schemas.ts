import { Group, Permission } from '@bokari/entities';
import { Exclude, Expose, Type } from "class-transformer";
import { IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

import { UserJoinable } from '../users';

@Exclude()
export class GroupInsertable {
  @Expose()
	@IsString()
	name!: string;

  @Expose()
	@IsEnum(Permission, { each: true })
	permissions!: Permission[];

  @Expose()
	@Type(() => UserJoinable)
	@ValidateNested({ each: true })
	users!: UserJoinable[];
}

@Exclude()
export class GroupUpdatable {
  @Expose()
	@IsOptional()
	@IsString()
	name?: string;

  @Expose()
	@IsOptional()
	@IsEnum(Permission, { each: true })
	permissions?: Permission[];

  @Expose()
	@Type(() => UserJoinable)
	@IsOptional()
	@ValidateNested({ each: true })
	users?: UserJoinable[];
}

@Exclude()
export class GroupJoinable implements Partial<Group> {
  @Expose()
	@IsInt()
	id!: number;
}
