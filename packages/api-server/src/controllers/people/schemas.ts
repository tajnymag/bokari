import { Expose, Type } from 'class-transformer';
import {
	IsEmail,
	IsOptional,
	IsPhoneNumber,
	IsPostalCode,
	IsString,
	ValidateNested
} from 'class-validator';

@Expose()
export class AddressInsertable {
	@IsString()
	street!: string;

	@IsPostalCode('any')
	zip!: string;

	@IsString()
	city!: string;

	@IsString()
	country!: string;

	@IsOptional()
	@IsString()
	state?: string;
}

@Expose()
export class ContactInsertable {
	@Type(() => AddressInsertable)
	@IsOptional()
	@ValidateNested()
	address?: AddressInsertable;

	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@IsPhoneNumber()
	phone?: string;

	@IsOptional()
	@IsString()
	note?: string;
}

@Expose()
export class ContactUpdatable {
	@Type(() => AddressInsertable)
	@IsOptional()
	@ValidateNested()
	address?: AddressInsertable;

	@IsOptional()
	@IsEmail()
	email?: string;

	@IsOptional()
	@IsPhoneNumber()
	phone?: string;

	@IsOptional()
	@IsString()
	note?: string;
}

@Expose()
export class PersonInsertable {
	@IsString()
	name!: string;

	@Type(() => ContactInsertable)
	@ValidateNested({ each: true })
	contacts!: ContactInsertable[];
}

@Expose()
export class PersonUpdatable {
	@IsOptional()
	@IsString()
	name?: string;

	@Type(() => ContactUpdatable)
	@ValidateNested({ each: true })
	contacts?: ContactUpdatable[];
}
