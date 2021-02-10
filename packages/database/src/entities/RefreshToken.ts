import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Metadata } from './Metadata';
import { User } from './User';
import { IsInt, IsIP, IsJWT, IsOptional, IsString, ValidateNested } from 'class-validator';

@Entity()
export class RefreshToken {
	@PrimaryGeneratedColumn()
	@IsOptional()
	@IsInt()
	id!: number;

	@Column({ unique: true })
	@IsJWT()
	token!: string;

	@Column()
	@IsIP()
	ip!: string;

	@Column(() => Metadata)
	@ValidateNested()
	metadata!: Metadata;

	@ManyToOne(
		() => User,
		user => user.refreshTokens,
		{ eager: true }
	)
	@ValidateNested()
	user!: User;
}