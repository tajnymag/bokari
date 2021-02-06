import {Column, Entity, ManyToOne, PrimaryGeneratedColumn} from "typeorm";
import {Contract} from "./Contract";
import {Phase} from "./Phase";
import {IsBoolean, IsDate, IsInt, ValidateNested} from "class-validator";

@Entity()
export class ContractPhase {
	@PrimaryGeneratedColumn()
	@IsInt()
	id!: number;

	@Column()
	@IsInt()
	contractId!: number;

	@Column()
	@IsInt()
	phaseId!: number;

	@Column("timestamptz")
	@IsDate()
	deadlineAt!: Date;

	@Column({default: false})
	@IsBoolean()
	isDone!: boolean;

	@ManyToOne(() => Contract, contract => contract.contractPhases)
	@ValidateNested({ each: true })
	contract!: Contract;

	@ManyToOne(() => Phase, phase => phase.contractPhases)
	@ValidateNested({ each: true })
	phase!: Phase;
}
