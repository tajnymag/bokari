import { Exclude, Expose, Transform, Type } from "class-transformer";
import {
	IsInt,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested
} from 'class-validator';

import { ToLowercaseAndTrim } from '../../helpers/transformations';
import { FileJoinable } from '../files';
import { GroupJoinable } from '../groups';
import { PersonInsertable, PersonUpdatable } from '../people';

@Exclude()
export class UserInsertable {
  @Expose()
	@Transform(ToLowercaseAndTrim)
	@IsString()
	username!: string;

  @Expose()
	@IsString()
	password!: string;

  @Expose()
	@Type(() => PersonInsertable)
	@ValidateNested()
	person!: PersonInsertable;

  @Expose()
	@Type(() => FileJoinable)
	@IsOptional()
	@ValidateNested()
	avatar?: FileJoinable;

  @Expose()
	@IsOptional()
	@Type(() => GroupJoinable)
	@ValidateNested({ each: true })
	groups?: GroupJoinable[];
}

@Exclude()
export class UserUpdatable {
  @Expose()
	@Type(() => PersonUpdatable)
	@IsOptional()
	@ValidateNested()
	person?: PersonUpdatable;

  @Expose()
	@Transform(ToLowercaseAndTrim)
	@IsOptional()
	@IsString()
	username?: string;

  @Expose()
	@IsOptional()
	@IsString()
	password?: string;

  @Expose()
	@Type(() => FileJoinable)
	@IsOptional()
	@ValidateNested()
	avatar?: FileJoinable;

  @Expose()
	@Type(() => GroupJoinable)
	@IsOptional()
	@ValidateNested({ each: true })
	groups?: GroupJoinable[];
}

@Exclude()
export class UserJoinable {
  @Expose()
	@IsInt()
	id!: number;
}
