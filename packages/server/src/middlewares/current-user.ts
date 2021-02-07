import { Action } from 'routing-controllers';
import { AccessTokenPayload } from '../common/jwt';
import { getRepository, User } from '@bokari/database';
import { classToPlain } from 'class-transformer';

export async function currentUserChecker(action: Action) {
	const jwtPayload: AccessTokenPayload = action.request.jwt;

	const user = getRepository(User).findOne(jwtPayload.user.id);

	return classToPlain(user);
}
