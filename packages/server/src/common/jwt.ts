import { SignOptions, verify as jwtVerify, sign as jwtSign } from 'jsonwebtoken';
import {
	Equals,
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
	validate,
	ValidateIf,
	ValidateNested,
	validateOrReject
} from 'class-validator';
import { plainToClass, Type } from 'class-transformer';

import { Permission, User } from '@bokari/database';
import { promisify } from 'util';
import { BadRequest } from '@curveball/http-errors';

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
		jwtSign(payload, 'TODO', options, (err, encoded) => {
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
	const payload = jwtVerify(token, 'TODO');

	if (expectedType === JwtType.ACCESS) {
		const errors = await validate(plainToClass(AccessTokenPayload, payload), {
			groups: ['jwt']
		});

		if (errors.length > 0) {
			throw new BadRequest('Wrong token structure!');
		}

		return payload as AccessTokenPayload;
	} else {
		const errors = await validate(plainToClass(RefreshTokenPayload, payload), {
			groups: ['jwt']
		});

		if (errors.length > 0) {
			throw new BadRequest('Wrong token structure!');
		}

		return payload as RefreshTokenPayload;
	}
}
