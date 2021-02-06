import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import {
	Equals,
	IsEnum,
	IsInt,
	IsOptional,
	IsString,
	validate, ValidateIf,
	ValidateNested, validateOrReject
} from "class-validator";
import {plainToClass, Type} from 'class-transformer';

import {Permission, User} from '@bokari/database';

export enum JwtType {
	ACCESS = 'access',
	REFRESH = 'refresh'
}

export class JwtPayload {
	@IsEnum(JwtType)
	type!: JwtType

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
	@IsEnum(Permission, {each: true})
	scopes?: Permission[];
}

export class AccessTokenPayload extends JwtPayload {
	@Equals("access")
	type!: JwtType.ACCESS;

	@IsEnum(Permission, {each: true})
	scopes!: Permission[];
}

export class RefreshTokenPayload extends JwtPayload {
	@Equals("refresh")
	type!: JwtType.REFRESH;
}

export function issueToken(
	payload: AccessTokenPayload | RefreshTokenPayload,
	options: SignOptions
): Promise<string> {
	return new Promise((resolve, reject) => {
		jwt.sign(payload, 'TODO', options, (err, encoded) => {
			if (err) {
				reject(err);
			} else {
				resolve(encoded ?? '');
			}
		});
	});
}

export function verifyToken(token: string): Promise<AccessTokenPayload | RefreshTokenPayload> {
	return new Promise((resolve, reject) => {
		jwt.verify(token, 'TODO', async (err, decoded) => {
			if ((err !== undefined) || (decoded === undefined)) {
				return reject(err);
			}

			await validateOrReject(plainToClass(JwtPayload, decoded), {
				groups: ["jwt"]
			});

			resolve(decoded as (AccessTokenPayload | RefreshTokenPayload));
		});
	});
}
