import { Exclude, Expose, Transform, Type } from 'class-transformer';
import {
	IsEmail,
	IsNotEmpty,
	IsOptional,
	IsPhoneNumber,
	IsPostalCode,
	IsString,
	ValidateNested
} from 'class-validator';

import { EmptyToUndefined } from '../../helpers/transformations';

@Exclude()
export class AddressInsertable {
	@Expose()
	@IsString()
	street!: string;

	@Expose()
	@IsPostalCode('any')
	zip!: string;

	@Expose()
	@IsString()
	city!: string;

	@Expose()
	@IsString()
	country!: string;

	@Expose()
	@IsOptional()
	@IsString()
	state?: string;
}

@Exclude()
export class ContactInsertable {
	@Expose()
	@Type(() => AddressInsertable)
	@IsOptional()
	@ValidateNested()
	address?: AddressInsertable;

	@Expose()
	@Transform(EmptyToUndefined, { toClassOnly: true })
	@IsOptional()
	@IsEmail()
	email?: string;

	@Expose()
	@Transform(EmptyToUndefined, { toClassOnly: true })
	@IsOptional()
	@IsPhoneNumber()
	phone?: string;

	@Expose()
	@IsOptional()
	@IsString()
	note?: string;
}

@Exclude()
export class ContactUpdatable {
	@Expose()
	@Type(() => AddressInsertable)
	@IsOptional()
	@ValidateNested()
	address?: AddressInsertable;

	@Expose()
	@Transform(EmptyToUndefined, { toClassOnly: true })
	@IsOptional()
	@IsEmail()
	email?: string;

	@Expose()
	@Transform(EmptyToUndefined, { toClassOnly: true })
	@IsOptional()
	@IsPhoneNumber()
	phone?: string;

	@Expose()
	@IsOptional()
	@IsString()
	note?: string;
}

@Exclude()
export class PersonInsertable {
	@Expose()
	@IsString()
	@IsNotEmpty()
	name!: string;

	@Expose()
	@Type(() => ContactInsertable)
	@ValidateNested({ each: true })
	contacts!: ContactInsertable[];
}

@Exclude()
export class PersonUpdatable {
	@Expose()
	@IsOptional()
	@IsString()
	@IsNotEmpty()
	name?: string;

	@Expose()
	@Type(() => ContactUpdatable)
	@ValidateNested({ each: true })
	contacts?: ContactUpdatable[];
}
