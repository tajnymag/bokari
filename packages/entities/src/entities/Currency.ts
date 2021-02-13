import { Column, DeepPartial, Entity, PrimaryColumn } from 'typeorm';
import { IsString, IsUppercase, Length } from 'class-validator';

@Entity()
export class Currency {
	@PrimaryColumn()
	@IsString()
	@Length(3)
	@IsUppercase()
	iso!: string;

	@Column()
	@IsString()
	name!: string;

	constructor(props?: DeepPartial<Currency>) {
		if (props) Object.assign(this, props);
	}
}
