import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './User';
import { Contract } from './Contract';
import { Metadata } from './Metadata';
import { IsDate, IsDateString, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';

@Entity()
export class WorkLog {
	@PrimaryGeneratedColumn()
	@IsOptional()
	@IsInt()
	id!: number;

	@Column('timestamptz')
	@IsDateString()
	from!: Date;

	@Column('timestamptz')
	@IsDateString()
	to!: Date;

	@Column({ nullable: true })
	@IsOptional()
	@IsString()
	description?: string;

	@Column(() => Metadata)
	@ValidateNested()
	metadata!: Metadata;

	@ManyToOne(
		() => User,
		user => user.workLogs,
		{ nullable: false }
	)
	@ValidateNested()
	user!: User;

	@ManyToOne(
		() => Contract,
		contract => contract.workLogs,
		{ nullable: true }
	)
	@IsOptional()
	@ValidateNested()
	contract?: Contract;
}
