import {Column, Entity, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {Contact} from "./Contact";
import {IsInt, IsString, ValidateNested} from "class-validator";
import {Type} from "class-transformer";

@Entity()
export abstract class Person {
	@PrimaryGeneratedColumn()
	@IsInt()
	id!: number;

	@Column()
	@IsString()
	name!: string;

	@OneToMany(() => Contact, contact => contact.person)
	@ValidateNested({ each: true })
	@Type(() => Contact)
	contacts!: Contact[];
}
