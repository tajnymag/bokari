import { Permission, User } from '@bokari/entities';
import { plainToClass, Type } from 'class-transformer';
import {
	Equals,
	IsEnum, IsIn,
	IsInt,
	IsOptional, IsString,
	validate,
	ValidateIf,
	ValidateNested, ValidationError
} from 'class-validator';
import { sign as jwtSign, SignOptions, verify as jwtVerify } from 'jsonwebtoken';
import { UnauthorizedError } from 'routing-controllers';

import { JWT_PRIVATE_KEY, JWT_PUBLIC_KEY } from '../env.config';

export enum JwtType {
	ACCESS = 'access',
	REFRESH = 'refresh'
}

export class JwtPayload {
	@IsEnum(JwtType)
	type!: JwtType;

	@ValidateNested()
	@Type(() => User)
	user!: Pick<User, 'id' | 'username'>;

	@IsOptional()
	@IsInt()
	iat?: number;

	@IsOptional()
	@IsInt()
	exp?: number;

	@ValidateIf(o => o.type === JwtType.ACCESS)
	@IsEnum(Permission, { each: true })
	scopes?: Permission[];
}

export class AccessTokenPayload extends JwtPayload {
	@Equals('access')
	type!: JwtType.ACCESS;

	@IsEnum(Permission, { each: true })
	scopes!: Permission[];
}

export class RefreshTokenPayload extends JwtPayload {
	@Equals('refresh')
	type!: JwtType.REFRESH;
}

export function issueToken(
	payload: AccessTokenPayload | RefreshTokenPayload,
	options: SignOptions
): Promise<string> {
	return new Promise((resolve, reject) => {
		jwtSign(payload, JWT_PRIVATE_KEY, options, (err, encoded) => {
			if (err) {
				reject(err);
			} else {
				resolve(encoded ?? '');
			}
		});
	});
}

export async function verifyToken(
	expectedType: JwtType.ACCESS,
	token: string
): Promise<AccessTokenPayload>;
export async function verifyToken(
	expectedType: JwtType.REFRESH,
	token: string
): Promise<RefreshTokenPayload>;
export async function verifyToken(
	expectedType: JwtType,
	token: string
): Promise<AccessTokenPayload | RefreshTokenPayload> {
	let payload;

	try {
		payload = jwtVerify(token, JWT_PUBLIC_KEY);
	} catch (err) {
		throw new UnauthorizedError('Invalid token provided!');
	}

	let validationErrors: ValidationError[] = [];

	if (expectedType === JwtType.ACCESS) {
		validationErrors = await validate(plainToClass(AccessTokenPayload, payload), {
			groups: ['jwt']
		});
	}

	if (expectedType === JwtType.REFRESH) {
		validationErrors = await validate(plainToClass(RefreshTokenPayload, payload), {
			groups: ['jwt']
		});
	}

	if (validationErrors.length > 0) {
		throw new UnauthorizedError('Invalid token provided!');
	}

	return payload as (AccessTokenPayload | RefreshTokenPayload);
}
