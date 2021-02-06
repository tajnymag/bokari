import {Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn} from "typeorm";
import {Person} from "./Person";
import {IsInt, ValidateNested} from "class-validator";

@Entity()
export class Customer {
	@PrimaryGeneratedColumn()
	@IsInt()
	id!: number;

	@OneToOne(() => Person, {nullable: false})
	@JoinColumn()
	@ValidateNested()
	person!: Person;
}
