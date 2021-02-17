import { JwtType, verifyToken } from '../common/jwt';
import { Action, UnauthorizedError } from 'routing-controllers';
import { Permission } from '@bokari/entities';

export async function authorizationChecker(action: Action, roles: Permission[]): Promise<boolean> {
	const authorizationHeader = action.request.headers.authorization;
	const token = authorizationHeader?.replace(/^Bearer/i, '').trim();

	if (!token) {
		throw new UnauthorizedError('No token provided!');
	}

	const payload = await verifyToken(JwtType.ACCESS, token);

	if (roles.some(scope => !payload.scopes.includes(scope))) {
		throw new UnauthorizedError('Insufficient permissions granted!');
	}

	action.request.jwt = payload;

	return true;
}
