import { Request } from 'express';
import { Permission, User } from '@bokari/shared';

export async function expressAuthentication(
	request: Request,
	securityName: string,
	scopes?: Permission[]
): Promise<Partial<User>> {
	return {
		id: 1
	};
}
