import {
	Column,
	Entity,
	JoinColumn,
	ManyToMany,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn
} from 'typeorm';
import { Group } from './Group';
import { File } from './File';
import { Person } from './Person';
import { WorkLog } from './WorkLog';
import { RefreshToken } from './RefreshToken';
import { IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Exclude, Type } from 'class-transformer';

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	@IsOptional()
	@IsInt({ groups: ['jwt'] })
	id!: number;

	@OneToOne(() => Person, {
		nullable: false,
		cascade: true
	})
	@JoinColumn()
	@ValidateNested()
	person!: Person;

	@Column({ unique: true })
	@IsString({ groups: ['jwt'] })
	username!: string;

	@Column()
	@Exclude()
	@IsString()
	passwordHash!: string;

	@ManyToOne(() => File, { cascade: true })
	@IsOptional()
	@ValidateNested()
	avatar?: File;

	@OneToMany(
		() => WorkLog,
		workLog => workLog.user,
		{ cascade: true }
	)
	@ValidateNested({ each: true })
	@Type(() => WorkLog)
	workLogs!: WorkLog[];

	@OneToMany(
		() => RefreshToken,
		refreshToken => refreshToken.user,
		{ cascade: true }
	)
	@Exclude()
	@ValidateNested({ each: true })
	@Type(() => RefreshToken)
	refreshTokens!: RefreshToken[];

	@ManyToMany(
		() => Group,
		group => group.users,
		{ cascade: true }
	)
	@ValidateNested({ each: true })
	@Type(() => Group)
	groups!: Group[];
}
