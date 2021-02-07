import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Address } from './Address';
import { Person } from './Person';
import { IsEmail, IsInt, IsOptional, IsPhoneNumber, IsString, ValidateNested } from 'class-validator';

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
	@ValidateNested({ each: true })
	person!: Person;

	@OneToOne(() => Address, { cascade: true })
	@JoinColumn()
	@IsOptional()
	@ValidateNested()
	address!: Address;

	@Column({ nullable: true })
	@IsOptional()
	@IsEmail()
	email!: string;

	@Column({ nullable: true })
	@IsOptional()
	@IsPhoneNumber()
	phone?: string;

	@Column({ nullable: true })
	@IsString()
	@IsOptional()
	note?: string;
}
