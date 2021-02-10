import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ContractPhase } from './ContractPhase';
import { Metadata } from './Metadata';
import { ContractAttachment } from './ContractAttachment';
import { WorkLog } from './WorkLog';
import { Customer } from './Customer';
import {
	IsBoolean,
	IsDate,
	IsDateString,
	IsInt, IsNotEmpty, IsNotEmptyObject,
	IsOptional,
	IsString,
	ValidateNested
} from 'class-validator';
import { Type } from 'class-transformer';

@Entity()
export class Contract {
	@PrimaryGeneratedColumn()
	@IsOptional()
	@IsInt()
	id!: number;

	@Column({ unique: true })
	@IsString()
	code!: string;

	@Column()
	@IsString()
	name!: string;

	@Column({ nullable: true })
	@IsOptional()
	@IsString()
	description?: string;

	@Column('timestamptz')
	@IsDateString()
	startAt!: Date;

	@Column('timestamptz')
	@IsDateString()
	deadlineAt!: Date;

	@Column()
	@IsOptional()
	@IsBoolean()
	isDone!: boolean;

	@Column(() => Metadata)
	@ValidateNested()
	metadata!: Metadata;

	@ManyToOne(() => Customer, { eager: true, nullable: false })
	@IsNotEmptyObject()
	@ValidateNested()
	customer!: Customer;

	@OneToMany(
		() => ContractAttachment,
		attachment => attachment.contract,
		{ cascade: true }
	)
	@ValidateNested({ each: true })
	@Type(() => ContractAttachment)
	attachments!: ContractAttachment[];

	@OneToMany(
		() => WorkLog,
		workLog => workLog.contract
	)
	@ValidateNested({ each: true })
	@Type(() => WorkLog)
	workLogs!: WorkLog[];

	@OneToMany(
		() => ContractPhase,
		phase => phase.contract,
		{ eager: true, cascade: true }
	)
	@ValidateNested({ each: true })
	@Type(() => ContractPhase)
	contractPhases!: ContractPhase[];
}
