import {
	Column,
	Entity,
	JoinColumn,
	ManyToOne,
	PrimaryColumn,
	PrimaryGeneratedColumn,
	Unique
} from 'typeorm';
import { Contract } from './Contract';
import { Phase } from './Phase';
import {
	IsBoolean,
	IsDateString, IsEmpty,
	IsInt, IsNotEmpty,
	IsOptional,
	ValidateNested
} from 'class-validator';

@Entity()
@Unique("unique_contract_phase", ["contract", "phase"])
export class ContractPhase {
	@PrimaryColumn()
	@IsOptional()
	@IsInt()
	contractId!: number;

	@PrimaryColumn()
	@IsNotEmpty()
	@IsInt()
	phaseId!: number;

	@Column('timestamptz')
	@IsDateString()
	deadlineAt!: Date;

	@Column({ default: false })
	@IsOptional()
	@IsBoolean()
	isDone!: boolean;

	@ManyToOne(
		() => Contract,
		contract => contract.contractPhases,
		{ primary: true }
	)
	@IsEmpty()
	@ValidateNested({ each: true })
	contract!: Contract;

	@ManyToOne(
		() => Phase,
		phase => phase.contractPhases,
		{ eager: true, primary: true }
	)
	@IsEmpty()
	@ValidateNested({ each: true })
	phase!: Phase;
}
