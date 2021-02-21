import { IsInt, IsOptional, IsString } from "class-validator";
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

	@Column({ nullable: true })
  @IsOptional()
	@IsString()
	state?: string;
}
