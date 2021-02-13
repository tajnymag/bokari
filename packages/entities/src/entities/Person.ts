import { Column, DeepPartial, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Contact } from './Contact';
import { Type } from 'class-transformer';
import { IsInt, IsString, ValidateNested } from 'class-validator';

@Entity()
export class Person {
	@PrimaryGeneratedColumn()
	@IsInt()
	id!: number;

	@Column()
	@IsString()
	name!: string;

	@OneToMany(
		() => Contact,
		contact => contact.person,
		{ eager: true, cascade: true }
	)
	@Type(() => Contact)
	@ValidateNested({ each: true })
	contacts!: Contact[];

	constructor(props?: DeepPartial<Person>) {
		if (props) Object.assign(this, props);
	}
}
