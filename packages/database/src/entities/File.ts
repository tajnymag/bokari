import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Metadata } from './Metadata';
import {
	IsAscii,
	IsHexadecimal,
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
	@IsHexadecimal()
	hash!: string;

	@Column()
	@IsString()
	filename!: string;

	@IsUrl({
		require_host: false,
		require_protocol: false,
		require_tld: false,
		require_valid_protocol: false
	})
	url!: string;

	@Column()
	@IsOptional()
	@IsMimeType()
	mimeType!: string;

	@Column(() => Metadata)
	@ValidateNested()
	metadata!: Metadata;
}
