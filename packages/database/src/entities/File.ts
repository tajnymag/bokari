import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";
import {Metadata} from "./Metadata";
import {IsAscii, IsInt, IsOptional, IsString, IsUrl, ValidateNested} from "class-validator";
import {Exclude} from "class-transformer";

@Entity()
export class File {
	@PrimaryGeneratedColumn()
	@IsInt()
	id!: number;

	@Column()
	@Exclude()
	@IsAscii()
	hash!: string;

	@Column()
	@IsString()
	filename!: string;

	@IsOptional()
	@IsUrl()
	url!: string;

	@Column(() => Metadata)
	@ValidateNested()
	metadata!: Metadata;
}
