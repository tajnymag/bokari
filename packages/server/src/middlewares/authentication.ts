import { Request as ExpressRequest } from 'express';
import { Permission } from '@bokari/shared';
import { BadRequest, Unauthorized } from '@curveball/http-errors';
import { AccessTokenPayload, verifyToken } from '../common/jwt';

export type TsoaRequest = ExpressRequest & AuthenticationPayload;

export interface AuthenticationPayload {
	jwt?: AccessTokenPayload;
}

export async function expressAuthentication(
	request: ExpressRequest,
	securityName: string,
	scopes?: Permission[]
): Promise<AuthenticationPayload> {
	console.log({scopes});
	if (securityName === 'jwt_access') {
		// TODO: remove when implemented authentication
		if (!process.env.NON_EXISTENT) {
			return {
				jwt: {
					type: 'access',
					user: {
						id: 3,
						username: 'admin'
					},
					scopes: [],
					iat: 1603983296,
					exp: 1603984196
				}
			};
		}

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
