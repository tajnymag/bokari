import * as jwt from 'jsonwebtoken';
import { SignOptions } from 'jsonwebtoken';
import { Permission, User } from '@bokari/shared';

export interface AccessTokenPayload {
	user: Pick<User, 'id' | 'username'>;
	scopes: Permission[];
}

export interface RefreshTokenPayload {
	user: Pick<User, 'id' | 'username'>;
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
				resolve(encoded);
			}
		});
	});
}

export function verifyToken(token: string): Promise<AccessTokenPayload | RefreshTokenPayload> {
	return new Promise((resolve, reject) => {
		jwt.verify(token, 'TODO', (err, decoded) => {
			if (err) {
				reject(err);
			} else {
				resolve(decoded as AccessTokenPayload);
			}
		});
	});
}
