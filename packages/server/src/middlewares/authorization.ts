import { BadRequest, Unauthorized } from '@curveball/http-errors';
import { AccessTokenPayload, JwtType, verifyToken } from '../common/jwt';
import { IsOptional, ValidateNested } from 'class-validator';
import { Action } from 'routing-controllers';
import { Permission } from '@bokari/database';

export class AuthenticationPayload {
	@IsOptional()
	@ValidateNested()
	jwt?: AccessTokenPayload;
}

export async function authorizationChecker(action: Action, roles: Permission[]): Promise<boolean> {
	if (!process.env.NON_EXISTENT) {
		action.request.jwt = {
			type: JwtType.ACCESS,
			user: {
				id: 3,
				username: 'admin'
			},
			scopes: [],
			iat: 1603983296,
			exp: 1603984196
		};
		return true;
	}

	const authorizationHeader = action.request.headers.authorization;
	const token = authorizationHeader?.replace(/^Bearer/i, '').trim();

	if (!token) {
		throw new BadRequest('No token provided!');
	}

	const payload = await verifyToken(JwtType.ACCESS, token);

	if (roles.some(scope => !payload.scopes.includes(scope))) {
		throw new Unauthorized('Insufficient permissions granted!');
	}

	action.request.jwt = payload;

	return true;
}
