import { Currency } from './Currency';
import { Column, DeepPartial, ManyToOne } from 'typeorm';
import { IsNumber, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class Monetary {
	@Column({ type: 'decimal', scale: 2 })
	@IsNumber({ maxDecimalPlaces: 2 })
	value!: number;

	@ManyToOne(() => Currency, { eager: true })
	@Type(() => Currency)
	@ValidateNested()
	currency!: Currency;

	constructor(props?: DeepPartial<Monetary>) {
		if (props) Object.assign(this, props);
	}
}
