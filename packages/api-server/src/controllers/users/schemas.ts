import { Expose, Transform, Type } from 'class-transformer';
import { PersonInsertable, PersonUpdatable } from '../people';
import { FileJoinable } from '../files';
import { GroupJoinable } from '../groups';
import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested
} from 'class-validator';
import { ToLowercaseAndTrim } from '../../helpers/transformations';

@Expose()
export class UserInsertable {
	@Transform(ToLowercaseAndTrim)
	@IsString()
	username!: string;

	@IsString()
	password!: string;

	@Type(() => PersonInsertable)
	@ValidateNested()
	person!: PersonInsertable;

	@Type(() => FileJoinable)
	@IsOptional()
	@ValidateNested()
	avatar?: FileJoinable;

	@IsOptional()
	@Type(() => GroupJoinable)
	@ValidateNested({ each: true })
	groups?: GroupJoinable[];
}

@Expose()
export class UserUpdatable {
	@Type(() => PersonUpdatable)
	@IsOptional()
	@ValidateNested()
	person?: PersonUpdatable;

	@Transform(ToLowercaseAndTrim)
	@IsOptional()
	@IsString()
	username?: string;

	@IsOptional()
	@IsString()
	password?: string;

	@Type(() => FileJoinable)
	@IsOptional()
	@ValidateNested()
	avatar?: FileJoinable;

	@Type(() => GroupJoinable)
	@IsOptional()
	@ValidateNested({ each: true })
	groups?: GroupJoinable[];
}

@Expose()
export class UserJoinable {
	@IsNotEmpty()
	@IsInt()
	id!: number;
}
