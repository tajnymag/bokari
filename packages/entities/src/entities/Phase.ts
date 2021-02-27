import { Exclude, Type } from 'class-transformer';
import { IsInt, IsString, ValidateNested } from 'class-validator';
import { Column, DeepPartial, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import { ContractPhase } from './ContractPhase';

@Entity()
export class Phase {
	@PrimaryGeneratedColumn()
	@IsInt()
	id!: number;

	@Column({ unique: true })
	@IsString()
	name!: string;

	@OneToMany(() => ContractPhase, contractPhase => contractPhase.phase, { cascade: true })
	@Exclude()
	@Type(() => ContractPhase)
	@ValidateNested({ each: true })
	contractPhases!: ContractPhase[];

	constructor(props?: DeepPartial<Phase>) {
		if (props) Object.assign(this, props);
	}
}
