import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsString, ValidateNested } from 'class-validator';
import {
	Column,
	DeepPartial,
	Entity,
	JoinTable,
	ManyToMany,
	PrimaryGeneratedColumn
} from 'typeorm';

import { Metadata } from './Metadata';
import { Permission } from './Permission';
import { User } from './User';

@Entity()
export class Group {
	@PrimaryGeneratedColumn()
	@IsInt()
	id!: number;

	@Column({ unique: true })
	@IsString()
	name!: string;

	@Column(() => Metadata)
	@Type(() => Metadata)
	@ValidateNested()
	metadata!: Metadata;

	@Column('enum', { enum: Permission, array: true })
	@IsEnum(Permission, { each: true })
	permissions!: Permission[];

	@ManyToMany(() => User, user => user.groups)
	@JoinTable()
	@Type(() => User)
	@ValidateNested({ each: true })
	users!: User[];

	constructor(props?: DeepPartial<Group>) {
		if (props) Object.assign(this, props);
	}
}
