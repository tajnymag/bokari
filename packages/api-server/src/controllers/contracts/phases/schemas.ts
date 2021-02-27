import { Exclude, Expose, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsDateString, ValidateNested } from 'class-validator';

@Exclude()
export class ContractPhaseInsertable {
	@Expose()
	@Type(() => Date)
	@IsDate()
	deadlineAt!: Date;

	@Expose()
	@IsBoolean()
	isDone!: boolean;

	@Expose()
	@ValidateNested()
	phaseId!: number;
}
