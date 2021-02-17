import { Group, Permission } from '@bokari/entities';
import { Expose, Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { UserJoinable } from '../users';

@Expose()
export class GroupInsertable {
	@IsString()
	name!: string;

	@IsEnum(Permission, { each: true })
	permissions!: Permission[];

	@Type(() => UserJoinable)
	@ValidateNested({ each: true })
	users!: UserJoinable[];
}

@Expose()
export class GroupUpdatable {
	@IsOptional()
	@IsString()
	name?: string;

	@IsOptional()
	@IsEnum(Permission, { each: true })
	permissions?: Permission[];

	@Type(() => UserJoinable)
	@IsOptional()
	@ValidateNested({ each: true })
	users?: UserJoinable[];
}

@Expose()
export class GroupJoinable implements Partial<Group> {
	@IsInt()
	id!: number;
}
