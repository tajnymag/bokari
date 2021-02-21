import { Exclude, Type } from 'class-transformer';
import {
  IsEmail,
  IsInt,
  IsOptional,
  IsPhoneNumber,
  IsString,
  ValidateNested
} from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Address } from './Address';
import { Person } from './Person';

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

	@OneToOne(() => Address, { eager: true, cascade: true, nullable: true })
	@JoinColumn()
	@Type(() => Address)
  @IsOptional()
	@ValidateNested()
	address?: Address;

	@Column({ nullable: true })
  @IsOptional()
	@IsEmail()
	email?: string;

	@Column({ nullable: true })
  @IsOptional()
	@IsPhoneNumber()
	phone?: string;

	@Column({ nullable: true })
  @IsOptional()
	@IsString()
	note?: string;
}
