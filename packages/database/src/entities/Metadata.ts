import { CreateDateColumn, DeleteDateColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { IsDate, IsDateString, IsOptional, ValidateNested } from 'class-validator';
import { User } from './User';

export class Metadata {
	@CreateDateColumn({ type: 'timestamptz' })
	@IsDateString()
	createdAt!: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	@IsDateString()
	updatedAt!: Date;

	@DeleteDateColumn({ type: 'timestamptz' })
	@IsOptional()
	@IsDateString()
	deletedAt?: Date;

	@ManyToOne(() => User, { nullable: false })
	@ValidateNested()
	createdBy!: User;

	constructor(props?: Partial<Metadata>) {
		if (props) Object.assign(this, props);
	}
}
