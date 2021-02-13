import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from './Address';
import { Person } from './Person';
import { IsEmail, IsInt, IsPhoneNumber, IsString, ValidateNested } from 'class-validator';
import { Exclude, Type } from 'class-transformer';

@Entity()
export class Contact {
	@PrimaryGeneratedColumn()
	@IsInt()
	id!: number;

	@ManyToOne(
		() => Person,
		person => person.contacts,
		{
			nullable: false
		}
	)
	@JoinColumn()
	@Exclude()
	@Type(() => Person)
	@ValidateNested()
	person!: Person;

	@OneToOne(() => Address, { eager: true, cascade: true })
	@JoinColumn()
	@Type(() => Address)
	@ValidateNested()
	address?: Address;

	@Column({ nullable: true })
	@IsEmail()
	email?: string;

	@Column({ nullable: true })
	@IsPhoneNumber()
	phone?: string;

	@Column({ nullable: true })
	@IsString()
	note?: string;
}
