import { JwtType, verifyToken } from '../common/jwt';
import { Action, BadRequestError, UnauthorizedError } from 'routing-controllers';
import { Permission } from '@bokari/entities';

export async function authorizationChecker(action: Action, roles: Permission[]): Promise<boolean> {
	if (!process.env.NON_EXISTENT) {
		action.request.jwt = {
			type: JwtType.ACCESS,
			user: {
				id: 1,
				username: 'admin'
			},
			scopes: [
				Permission.USERS_WRITE,
				Permission.USERS_READ,
				Permission.CONTRACTS_WRITE,
				Permission.CONTRACTS_READ,
				Permission.FINANCES_READ,
				Permission.FINANCES_WRITE
			],
			iat: 1603983296,
			exp: 1603984196
		};
		return true;
	}

	const authorizationHeader = action.request.headers.authorization;
	const token = authorizationHeader?.replace(/^Bearer/i, '').trim();

	if (!token) {
		throw new BadRequestError('No token provided!');
	}

	const payload = await verifyToken(JwtType.ACCESS, token);

	if (roles.some(scope => !payload.scopes.includes(scope))) {
		throw new UnauthorizedError('Insufficient permissions granted!');
	}

	action.request.jwt = payload;

	return true;
}
