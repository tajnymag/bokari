import { CreateDateColumn, DeleteDateColumn, ManyToOne, UpdateDateColumn } from 'typeorm';
import { IsDate, IsOptional, ValidateNested } from 'class-validator';
import { User } from './User';

export class Metadata {
	@CreateDateColumn({ type: 'timestamptz' })
	@IsDate()
	createdAt!: Date;

	@UpdateDateColumn({ type: 'timestamptz' })
	@IsDate()
	updatedAt!: Date;

	@DeleteDateColumn({ type: 'timestamptz' })
	@IsOptional()
	@IsDate()
	deletedAt?: Date;

	@ManyToOne(() => User, { cascade: ['insert'] })
	@ValidateNested()
	createdBy!: User;
}
