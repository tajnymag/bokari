import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Person } from './Person';
import { IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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
}
