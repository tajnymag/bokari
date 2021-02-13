import { Column, Entity, ManyToOne, PrimaryColumn, Unique } from 'typeorm';
import { Contract } from './Contract';
import { Phase } from './Phase';
import { Exclude, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsInt, ValidateNested } from 'class-validator';

@Entity()
@Unique('unique_contract_phase', ['contract', 'phase'])
export class ContractPhase {
	@PrimaryColumn()
	@Exclude({ toPlainOnly: true })
	@IsInt()
	contractId!: number;

	@PrimaryColumn()
	@Exclude({ toPlainOnly: true })
	@IsInt()
	phaseId!: number;

	@Column('timestamptz')
	@Type(() => Date)
	@IsDate()
	deadlineAt!: Date;

	@Column({ default: false })
	@IsBoolean()
	isDone!: boolean;

	@ManyToOne(
		() => Contract,
		contract => contract.contractPhases,
		{ primary: true }
	)
	@Exclude()
	@Type(() => Contract)
	@ValidateNested()
	contract!: Contract;

	@ManyToOne(
		() => Phase,
		phase => phase.contractPhases,
		{ eager: true, primary: true }
	)
	@Type(() => Phase)
	@ValidateNested()
	phase!: Phase;
}
