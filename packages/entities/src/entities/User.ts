import { Exclude, Transform, Type } from 'class-transformer';
import { IsHexadecimal, IsInt, IsLowercase, IsString, ValidateNested } from 'class-validator';
import {
  Column, DeepPartial,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn
} from "typeorm";

import { ToLowercaseAndTrim } from '../transformations';

import { File } from './File';
import { Group } from './Group';
import { Person } from './Person';
import { RefreshToken } from './RefreshToken';
import { WorkLog } from './WorkLog';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	@IsInt()
	id!: number;

	@OneToOne(() => Person, {
		eager: true,
		nullable: false,
		cascade: true
	})
	@JoinColumn()
	@Type(() => Person)
	@ValidateNested()
	person!: Person;

	@Column({ unique: true })
	@Transform(ToLowercaseAndTrim)
	@IsString()
	@IsLowercase()
	username!: string;

	@Column()
	@Exclude()
	@IsHexadecimal()
	passwordHash!: string;

	@ManyToOne(() => File, { eager: true, cascade: true })
	@Type(() => File)
	@ValidateNested()
	avatar?: File;

	@OneToMany(
		() => WorkLog,
		workLog => workLog.user,
		{ cascade: true }
	)
	@Type(() => WorkLog)
	@ValidateNested({ each: true })
	workLogs!: WorkLog[];

	@OneToMany(
		() => RefreshToken,
		refreshToken => refreshToken.user,
		{ cascade: true }
	)
	@Exclude()
	@Type(() => RefreshToken)
	@ValidateNested({ each: true })
	refreshTokens!: RefreshToken[];

	@ManyToMany(
		() => Group,
		group => group.users,
		{ cascade: true }
	)
	@Type(() => Group)
	@ValidateNested({ each: true })
	groups!: Group[];

  constructor(props?: DeepPartial<User>) {
    if (props) Object.assign(this, props);
  }
}
