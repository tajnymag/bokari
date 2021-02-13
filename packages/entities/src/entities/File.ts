import { Column, Entity, PrimaryGeneratedColumn, Unique } from 'typeorm';
import { Metadata } from './Metadata';
import { IsInt, IsHash, IsString, IsMimeType, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

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
