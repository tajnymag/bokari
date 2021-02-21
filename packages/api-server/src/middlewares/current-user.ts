import { Permission, User } from '@bokari/entities';
import { Action } from 'routing-controllers';

import { AccessTokenPayload } from '../common/jwt';

export class CurrentUserPayload {
	id!: number;
	username!: string;
	permissions!: Permission[];

	constructor(props?: Partial<CurrentUserPayload>) {
		if (props) Object.assign(this, props);
	}
}

export async function currentUserChecker(action: Action) {
	const jwtPayload: AccessTokenPayload = action.request.jwt;

	return new CurrentUserPayload({ ...jwtPayload.user, permissions: jwtPayload.scopes });
}
