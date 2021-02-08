import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Person } from './Person';
import { IsInt, IsOptional, ValidateIf, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@Entity()
export class Customer {
	@PrimaryGeneratedColumn()
	@IsOptional()
	@IsInt()
	id!: number;

	@OneToOne(() => Person, { nullable: false, cascade: true })
	@JoinColumn()
	@ValidateNested()
	person!: Person;
}
