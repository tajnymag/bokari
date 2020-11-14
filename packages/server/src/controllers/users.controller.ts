import { Body, Controller, Get, Path, Post, Route, SuccessResponse } from 'tsoa';
import { User, UserInsertable } from '@bokari/shared';

import { UserWhereUniqueInput } from '@bokari/database';
import { Forbidden, NotFound } from '@curveball/http-errors';
import * as argon2 from 'argon2';
import { db } from '../common/db';
import { normalizePermissionQuery, normalizeUserQuery } from '../helpers/db-aggregate';

const RICH_USER_INCLUDE = {
	wages: {
		include: {
			monetaryValue: true
		}
	},
	person: {
		include: {
			personContacts: {
				include: {
					contact: {
						include: {
							address: true
						}
					}
				}
			}
		}
	},
	groupUsers: {
		include: {
			group: {
				include: {
					groupPermissions: {
						include: {
							permission: true
						}
					}
				}
			}
		}
	}
};

@Route('users')
export class UsersController extends Controller {
	@Get()
	public async getAllUsers(): Promise<User[]> {
		const queryResult = await db.user.findMany({
			include: {
				...RICH_USER_INCLUDE
			}
		});

		const users = queryResult ? queryResult?.map(normalizeUserQuery) : [];

		return users.map((user) => ({
			id: user.id,
			name: user.name,
			permissions: user.permissions,
			groups: user.groups,
			contacts: user.contacts,
			username: user.username,
			wage: user.wage
		}));
	}

	@Get('{userId}')
	public async getUser(@Path() userId: number): Promise<User> {
		const queryResult = await db.user.findOne({
			where: { id: userId },
			include: {
				...RICH_USER_INCLUDE
			}
		});

		if (!queryResult) {
			throw new NotFound(`A user with id ${userId} was not found!`);
		}

		const user = normalizeUserQuery(queryResult);

		return {
			id: user.id,
			name: user.name,
			permissions: user.permissions,
			groups: user.groups,
			contacts: user.contacts,
			username: user.username,
			wage: user.wage
		};
	}

	@SuccessResponse('201', 'Created')
	@Post()
	public async createUser(@Body() user: UserInsertable): Promise<User> {
		if (await this.existsUser({ username: user.username })) {
			throw new Forbidden('A user with such username already exists!');
		}

		const passwordHash = await argon2.hash(user.password);

		const createdUser = await db.user.create({
			data: {
				username: user.username.toLowerCase(),
				person: {
					create: {
						name: user.name
					}
				},
				passwordHash,
				groupUsers: {
					create: user.groups.map((groupName) => ({
						group: {
							connect: {
								name: groupName
							}
						}
					}))
				}
			},
			include: {
				...RICH_USER_INCLUDE,
				person: true,
				wages: false
			}
		});

		const permissions = createdUser.groupUsers
			.map((gu) => gu.group)
			.map((g) => g.groupPermissions)
			.flatMap((gp) => gp.map((p) => normalizePermissionQuery(p.permission)));

		return {
			id: createdUser.id,
			name: createdUser.person.name,
			username: createdUser.username,
			groups: user.groups,
			permissions: [...new Set(permissions)],
			contacts: []
		};
	}

	private async existsUser(query: UserWhereUniqueInput): Promise<boolean> {
		const foundId = await db.user.findOne({
			where: query,
			select: { id: true }
		});

		return foundId !== null;
	}
}
