import { Currency } from './Currency';
import { Column, DeepPartial } from 'typeorm';
import { IsEnum, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';
import { ParseFloat } from '../transformations';

export class Monetary {
	@Column({ type: 'decimal', scale: 2 })
	@Transform(ParseFloat, { toClassOnly: true })
	@IsNumber({ maxDecimalPlaces: 2 })
	amount!: number;

	@Column('enum', { enum: Currency })
	@IsEnum(Currency)
	currency!: Currency;

	constructor(props?: DeepPartial<Monetary>) {
		if (props) Object.assign(this, props);
	}
}
