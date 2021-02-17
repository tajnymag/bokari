import { Expose, Type } from 'class-transformer';
import { IsBoolean, IsDate, IsDateString, ValidateNested } from 'class-validator';

@Expose()
export class ContractPhaseInsertable {
	@Type(() => Date)
	@IsDate()
	deadlineAt!: Date;

	@IsBoolean()
	isDone!: boolean;

	@ValidateNested()
	phaseId!: number;
}
