import * as argon2 from 'argon2';
import { Forbidden } from '@curveball/http-errors';

import { UserWhereUniqueInput } from '@bokari/database';
import { Contact, User, UserInsertable } from '@bokari/shared';

import { db } from '../../common/db';

export async function existsUser(query: UserWhereUniqueInput): Promise<boolean> {
	const foundId = await db.user.findOne({
		where: { username: query.username },
		select: { id: true }
	});

	return foundId !== null;
}

export async function createUser(user: UserInsertable): Promise<User> {
	if (!(await existsUser({ username: user.username }))) {
		throw new Forbidden('A user with such username already exists!');
	}

	const passwordHash = await argon2.hash(user.password);

	const createdUser = await db.user.create({
		data: {
			username: user.username,
			person: {
				create: {
					name: user.name
				}
			},
			passwordHash
		},
		include: {
			person: true
		}
	});

	return {
		id: createdUser.id,
		username: createdUser.username,
		name: createdUser.person.name,
		contacts: [],
		permissions: []
	};
}
