import { Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Type } from 'class-transformer';
import { Permission } from './Permission';
import { User } from './User';
import { IsEnum, IsInt, IsString, ValidateNested } from 'class-validator';

@Entity()
export class Group {
	@PrimaryGeneratedColumn()
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
	@Type(() => User)
	@ValidateNested({ each: true })
	users!: User[];
}
