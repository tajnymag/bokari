import {
	CreateDateColumn,
	DeepPartial,
	DeleteDateColumn,
	ManyToOne,
	UpdateDateColumn
} from 'typeorm';
import { User } from './User';
import { IsDate, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class Metadata {
	@CreateDateColumn({ type: 'timestamptz' })
	@Type(() => Date)
	@IsDate()
	createdAt!: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	@Type(() => Date)
	@IsDate()
	updatedAt!: Date;

	@DeleteDateColumn({ type: 'timestamptz' })
	@Type(() => Date)
	@IsDate()
	deletedAt?: Date;

	@ManyToOne(() => User, { nullable: false })
	@Type(() => User)
	@ValidateNested()
	createdBy!: User;

	constructor(props?: DeepPartial<Metadata>) {
		if (props) Object.assign(this, props);
	}
}
