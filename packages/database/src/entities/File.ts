import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Metadata } from './Metadata';
import {
	IsAscii,
	IsInt,
	IsMimeType,
	IsOptional,
	IsString,
	IsUrl,
	ValidateNested
} from 'class-validator';

@Entity()
export class File {
	@PrimaryGeneratedColumn()
	@IsOptional()
	@IsInt()
	id!: number;

	@Column()
	@IsAscii()
	hash!: string;

	@Column()
	@IsString()
	filename!: string;

	@Column()
	@IsOptional()
	@IsUrl()
	url!: string;

	@Column()
	@IsOptional()
	@IsMimeType()
	mimeType!: string;

	@Column(() => Metadata)
	@ValidateNested()
	metadata!: Metadata;
}
