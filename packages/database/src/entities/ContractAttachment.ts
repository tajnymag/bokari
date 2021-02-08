import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Metadata } from './Metadata';
import { File } from './File';
import { Contract } from './Contract';
import {
	IsDefined,
	IsInt,
	IsOptional,
	IsString,
	ValidateIf,
	ValidateNested
} from 'class-validator';

@Entity()
export class ContractAttachment {
	@PrimaryGeneratedColumn()
	@IsOptional()
	@IsInt()
	id!: number;

	@OneToOne(() => File, { cascade: true })
	@JoinColumn()
	@IsOptional()
	@ValidateNested()
	file!: File;

	@Column()
	@IsOptional()
	@IsString()
	note!: string;

	@Column(() => Metadata)
	@ValidateNested()
	metadata!: Metadata;

	@ManyToOne(() => Contract)
	@ValidateNested()
	contract!: Contract;
}
