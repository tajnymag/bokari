import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ContractPhase } from './ContractPhase';
import { Metadata } from './Metadata';
import { ContractAttachment } from './ContractAttachment';
import { WorkLog } from './WorkLog';
import { Customer } from './Customer';
import { IsBoolean, IsDate, IsInt, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@Entity()
export class Contract {
	@PrimaryGeneratedColumn()
	@IsInt()
	id!: number;

	@Column({ unique: true })
	@IsString()
	code!: string;

	@Column()
	@IsString()
	name!: string;

	@Column()
	@IsString()
	description!: string;

	@Column('timestamptz')
	@IsDate()
	startAt!: Date;

	@Column('timestamptz')
	@IsDate()
	deadlineAt!: Date;

	@Column({ default: false })
	@IsBoolean()
	isDone!: boolean;

	@Column(() => Metadata)
	@ValidateNested()
	metadata!: Metadata;

	@ManyToOne(() => Customer)
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
		phase => phase.contractId,
		{ cascade: true }
	)
	@ValidateNested({ each: true })
	@Type(() => ContractPhase)
	contractPhases!: ContractPhase[];
}
