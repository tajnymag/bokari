import { Type } from 'class-transformer';
import { IsInt, IsHash, IsString, IsMimeType, ValidateNested } from 'class-validator';
import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { Metadata } from './Metadata';

@Entity()
@Unique('unqiue_filename_hash', ['hash', 'filename'])
export class File {
	@PrimaryGeneratedColumn()
	@IsInt()
	id!: number;

	@Column()
	@IsHash('sha256')
	hash!: string;

	@Column()
	@IsString()
	filename!: string;

	@Column()
	@IsString()
	url!: string;

	@Column()
	@IsMimeType()
	mimeType!: string;

	@Column(() => Metadata)
	@Type(() => Metadata)
	@ValidateNested()
	metadata!: Metadata;
}
