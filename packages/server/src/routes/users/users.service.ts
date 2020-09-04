import { User, UserInsertable } from '@bokari/shared';
import { db } from '../../common/db';

export class UsersService {
	static async createUser(user: UserInsertable) {
		return db.user.create({
			data: {
				username: user.username,
				person: {
					create: {
						name: user.name
					}
				},
				passwordHash: '6c8a5cbf92f5e5942cdb6e5f1bd25fb0',
				wages: {
					create: {
						createdById: 0,
						monetaryValue: {
							create: {
								amount: user.wage.amount,
								currency: {
									connect: {
										isoCode: user.wage.currency
									}
								}
							}
						}
					}
				}
			}
		});
	}
}
