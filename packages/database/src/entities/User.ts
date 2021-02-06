import {
	Column,
	Entity,
	JoinColumn, ManyToMany,
	ManyToOne,
	OneToMany,
	OneToOne,
	PrimaryGeneratedColumn
} from "typeorm";
import {File} from "./File";
import {Person} from "./Person";
import {WorkLog} from "./WorkLog";
import {RefreshToken} from "./RefreshToken";
import {IsInt, IsString, ValidateNested} from "class-validator";
import {Exclude, Type } from "class-transformer";

@Entity()
export class User {
	@PrimaryGeneratedColumn()
	@IsInt({groups: ['jwt']})
	id!: number;

	@OneToOne(() => Person, {
		nullable: false
	})
	@JoinColumn()
	@ValidateNested()
	person!: Person;

	@Column({unique: true})
	@IsString({groups: ['jwt']})
	username!: string;

	@Column()
	@Exclude()
	@IsString()
	passwordHash!: string;

	@ManyToOne(() => File)
	@ValidateNested()
	avatar!: File;

	@OneToMany(() => WorkLog, workLog => workLog.user)
	@ValidateNested({ each: true })
	@Type(() => WorkLog)
	workLogs!: WorkLog[];

	@OneToMany(() => RefreshToken, refreshToken => refreshToken.user)
	@Exclude()
	@ValidateNested({ each: true })
	@Type(() => RefreshToken)
	refreshTokens!: RefreshToken[];

	@ManyToMany(() => Group, group => group.users)
	@ValidateNested({ each: true })
	@Type(() => Group)
	groups!: Group[];
}
