import { Request } from 'express';
import { Permission } from '@bokari/shared';
import { BadRequest, Unauthorized } from '@curveball/http-errors';
import { AccessTokenPayload, verifyToken } from '../common/jwt';

export interface AuthenticationPayload {
	jwt?: AccessTokenPayload;
}

export async function expressAuthentication(
	request: Request,
	securityName: string,
	scopes?: Permission[]
): Promise<AuthenticationPayload> {
	if (securityName === 'jwt_access') {
		const authorizationHeader = request.headers.authorization;
		const token = authorizationHeader?.replace(/^Bearer/i, '').trim();

		if (!token) {
			throw new BadRequest('No token provided!');
		}

		const payload = await verifyToken(token);

		if (payload.type !== 'access') {
			throw new BadRequest('Wrong token type!');
		}

		if (scopes?.some((scope) => !payload.scopes.includes(scope))) {
			throw new Unauthorized('Insufficient permissions granted!');
		}

		return { jwt: payload };
	}

	return {};
}
