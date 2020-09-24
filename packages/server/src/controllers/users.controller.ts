import { Body, Controller, Get, Path, Post, Route, SuccessResponse } from 'tsoa';
import { User } from '@bokari/shared';

import { UserWhereUniqueInput } from '@bokari/database';
import { Forbidden, NotFound } from '@curveball/http-errors';
import * as argon2 from 'argon2';
import { db } from '../common/db';
import { normalizeUserQuery } from '../helpers/db-aggregate';

export type UserInsertable = Pick<
	Required<User>,
	'name' | 'username' | 'password' | 'permissions' | 'wage'
>;

@Route('users')
export class UsersController extends Controller {
	@Get('{userId}')
	public async getUser(@Path() userId: number): Promise<User> {
		const queryResult = await db.user.findOne({
			where: { id: userId },
			include: {
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
			contacts: user.contacts,
			username: user.username,
			wage: user.wage
		};
	}

	@SuccessResponse('201', 'Created')
	@Post()
	public async createUser(@Body() requestBody: UserInsertable): Promise<User> {
		const user = requestBody;

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
				passwordHash
			},
			include: {
				person: true
			}
		});

		return {
			id: createdUser.id,
			username: createdUser.username,
			name: createdUser.person.name
		};
	}

	private async existsUser(query: UserWhereUniqueInput): Promise<boolean> {
		const foundId = await db.user.findOne({
			where: { username: query.username },
			select: { id: true }
		});

		return foundId !== null;
	}
}
