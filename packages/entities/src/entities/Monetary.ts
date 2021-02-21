import { Transform } from 'class-transformer';
import { IsEnum, IsNumber } from 'class-validator';
import { Column, DeepPartial } from 'typeorm';

import { ParseFloat } from '../transformations';

import { Currency } from './Currency';

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
