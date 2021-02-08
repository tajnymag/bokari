import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Permission } from './Permission';
import { User } from './User';
import { IsEnum, IsInt, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

@Entity()
export class Group {
	@PrimaryGeneratedColumn()
	@IsOptional()
	@IsInt()
	id!: number;

	@Column({ unique: true })
	@IsString()
	name!: string;

	@Column('enum', { enum: Permission, array: true })
	@IsEnum(Permission, { each: true })
	permissions!: Permission[];

	@ManyToMany(
		() => User,
		user => user.groups
	)
	@JoinTable()
	@ValidateNested({ each: true })
	@Type(() => User)
	users!: User[];
}
