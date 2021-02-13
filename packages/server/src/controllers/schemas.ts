import { Type } from 'class-transformer';
import { IsNumber, IsString, IsUppercase, Length, Min, ValidateNested } from 'class-validator';

export class CurrencyJoinable {
	@IsUppercase()
	@Length(3)
	@IsString()
	iso!: string;
}

export class MonetaryInsertable {
	@Min(0)
	@IsNumber({ maxDecimalPlaces: 2 })
	value!: number;

	@Type(() => CurrencyJoinable)
	@ValidateNested()
	currency!: CurrencyJoinable;
}

