import { Exclude, Type } from 'class-transformer';
import { IsInt, IsString, ValidateNested } from 'class-validator';
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import { Contract } from './Contract';
import { File } from './File';
import { Metadata } from './Metadata';

@Entity()
export class ContractAttachment {
	@PrimaryGeneratedColumn()
	@IsInt()
	id!: number;

	@OneToOne(() => File, { eager: true, cascade: true })
	@JoinColumn()
	@Type(() => File)
	@ValidateNested()
	file?: File;

	@Column({ default: '' })
	@IsString()
	note!: string;

	@Column(() => Metadata)
	@Type(() => Metadata)
	@ValidateNested()
	metadata!: Metadata;

	@ManyToOne(() => Contract)
	@Exclude()
	@Type(() => Contract)
	@ValidateNested()
	contract!: Contract;
}
