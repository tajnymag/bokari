import { User, UserInsertable } from '@bokari/shared';
import { compareDesc } from 'date-fns';
import { db } from '../../common/db';
import {
	normalizeContactQuery,
	normalizeMonetaryValueQuery,
	normalizePermissionQuery
} from '../../helpers/db-aggregate';

import { BaseDataService } from './base.data';

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

type StoredUserData = User & { passwordHash: string };

export class UsersDataService implements BaseDataService {
	async findOne(query: Partial<User>): Promise<StoredUserData | null> {
		const rawUser = await db.user.findFirst({
			where: {
				id: query.id,
				username: query.username,
				person: {
					name: query.name
				}
			},
			include: {
				...RICH_USER_INCLUDE
			}
		});

		if (!rawUser) {
			return null;
		}

		const groups = rawUser.groupUsers.map((gu) => gu.group).map((g) => g.name);

		const permissions = rawUser.groupUsers
			.map((gu) => gu.group)
			.map((g) => g.groupPermissions)
			.flatMap((gp) => gp.map((p) => normalizePermissionQuery(p.permission)));

		const wage = rawUser.wages
			.sort((wa, wb) => compareDesc(wa.createdAt, wb.createdAt))
			.map((w) => normalizeMonetaryValueQuery(w.monetaryValue))[0];

		const contacts = rawUser.person.personContacts
			.map((pc) => pc.contact)
			.map(normalizeContactQuery);

		return {
			id: rawUser.id,
			name: rawUser.person.name,
			username: rawUser.username,
			passwordHash: rawUser.passwordHash,
			groups: groups,
			permissions: [...new Set(permissions)],
			contacts: contacts,
			wage: wage
		};
	}

	async findMany(): Promise<StoredUserData[]> {
		const rawUsers = await db.user.findMany({
			include: {
				...RICH_USER_INCLUDE
			}
		});

		if (!rawUsers.length) {
			return [];
		}

		return rawUsers.map((rawUser) => {
			const groups = rawUser.groupUsers.map((gu) => gu.group).map((g) => g.name);

			const permissions = rawUser.groupUsers
				.map((gu) => gu.group)
				.map((g) => g.groupPermissions)
				.flatMap((gp) => gp.map((p) => normalizePermissionQuery(p.permission)));

			const wage = rawUser.wages
				.sort((wa, wb) => compareDesc(wa.createdAt, wb.createdAt))
				.map((w) => normalizeMonetaryValueQuery(w.monetaryValue))[0];

			const contacts = rawUser.person.personContacts
				.map((pc) => pc.contact)
				.map(normalizeContactQuery);

			return {
				id: rawUser.id,
				name: rawUser.person.name,
				username: rawUser.username,
				passwordHash: rawUser.passwordHash,
				groups: groups,
				permissions: [...new Set(permissions)],
				contacts: contacts,
				wage: wage
			};
		});
	}

	async updateOne(data: Partial<User>, query: Partial<User>): Promise<StoredUserData> {
		const rawResponse = await db.user.update({
			data: {},
			where: {
				id: query.id,
				username: query.username
			}
		});

		const updatedUser = await this.findOne({ id: rawResponse.id });

		return updatedUser as StoredUserData;
	}

	async createOne(
		user: UserInsertable & Pick<StoredUserData, 'passwordHash'>
	): Promise<StoredUserData> {
		const rawCreatedUser = await db.user.create({
			data: {
				username: user.username,
				person: {
					create: {
						name: user.name
					}
				},
				passwordHash: user.passwordHash,
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

		const permissions = rawCreatedUser.groupUsers
			.map((gu) => gu.group)
			.map((g) => g.groupPermissions)
			.flatMap((gp) => gp.map((p) => normalizePermissionQuery(p.permission)));

		return {
			id: rawCreatedUser.id,
			name: rawCreatedUser.person.name,
			username: rawCreatedUser.username,
			passwordHash: rawCreatedUser.passwordHash,
			groups: user.groups,
			permissions: [...new Set(permissions)],
			contacts: []
		};
	}

	async deleteOne(query: Partial<User>): Promise<void> {
		const rawResponse = await db.user.delete({
			where: {
				id: query.id,
				username: query.username
			}
		});
	}
}

export const usersDataService = new UsersDataService();
