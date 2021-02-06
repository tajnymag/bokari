import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {IsInt, IsOptional, IsString} from "class-validator";

@Entity()
export class Address {
	@PrimaryGeneratedColumn()
	@IsInt()
	id!: number;

	@Column()
	@IsString()
	street!: string;

	@Column()
	@IsString()
	zip!: string;

	@Column()
	@IsString()
	city!: string;

	@Column()
	@IsString()
	country!: string;

	@Column()
	@IsString()
	state!: string;
}
