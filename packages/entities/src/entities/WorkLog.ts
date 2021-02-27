import { Type } from 'class-transformer';
import { IsDate, IsInt, IsString, ValidateNested } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Contract } from './Contract';
import { Metadata } from './Metadata';
import { User } from './User';

@Entity()
@Unique('unique_worklog_user_time', ['from', 'to', 'user'])
export class WorkLog {
	@PrimaryGeneratedColumn()
	@IsInt()
	id!: number;

	@Column('timestamptz')
	@Type(() => Date)
	@IsDate()
	from!: Date;

	@Column('timestamptz')
	@Type(() => Date)
	@IsDate()
	to!: Date;

	@Column({ nullable: true })
	@IsString()
	description?: string;

	@Column(() => Metadata)
	@Type(() => Metadata)
	@ValidateNested()
	metadata!: Metadata;

	@ManyToOne(() => User, user => user.workLogs, { nullable: false })
	@Type(() => User)
	@ValidateNested()
	user!: User;

	@ManyToOne(() => Contract, contract => contract.workLogs, { nullable: true })
	@Type(() => Contract)
	contract?: Contract;
}
