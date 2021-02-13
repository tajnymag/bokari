import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ContractPhase } from './ContractPhase';
import { Exclude, Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

@Entity()
export class Phase {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ unique: true })
	name!: string;

	@OneToMany(
		() => ContractPhase,
		contractPhase => contractPhase.phase,
		{ cascade: true }
	)
	@Exclude()
	@Type(() => ContractPhase)
	@ValidateNested({ each: true })
	contractPhases!: ContractPhase[];
}
