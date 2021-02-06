import {CreateDateColumn, DeleteDateColumn, ManyToOne, UpdateDateColumn} from "typeorm";
import {User} from "./User";
import {IsDate, IsOptional, ValidateNested} from "class-validator";

export class Metadata {
	@CreateDateColumn({ type: "timestamptz" })
	@IsDate()
	createdAt!: Date;

	@UpdateDateColumn({ type: "timestamptz" })
	@IsDate()
	updatedAt!: Date;

	@DeleteDateColumn({ type: "timestamptz" })
	@IsOptional()
	@IsDate()
	deletedAt?: Date;

	@ManyToOne(() => User)
	@ValidateNested()
	createdBy!: User;
}
