import { Exclude, Type } from 'class-transformer';
import { IsInt, IsOptional, ValidateNested } from 'class-validator';
import {
	Entity,
	JoinColumn,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn
} from 'typeorm';

import { Contract } from './Contract';
import { Person } from './Person';

@Entity()
export class Customer {
	@PrimaryGeneratedColumn()
	@IsInt()
	id!: number;

	@OneToOne(() => Person, { eager: true, nullable: false, cascade: true })
	@JoinColumn()
	@Type(() => Person)
	@ValidateNested()
	person!: Person;

	@OneToMany(() => Contract, contract => contract.customer)
	@Exclude({ toClassOnly: true })
	@Type(() => Contract)
	@IsOptional()
	@ValidateNested({ each: true })
	contracts?: Contract;
}
