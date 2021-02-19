import { Column, DeepPartial, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Contact } from './Contact';
import { Type } from 'class-transformer';
import { IsInt, IsString, ValidateNested } from 'class-validator';

@Entity()
@Index('person_name_trgm', { synchronize: false })
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
