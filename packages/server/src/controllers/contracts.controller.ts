import { Controller, Get } from 'tsoa';
import { Contract } from '@bokari/shared';
import { db } from '../common/db';

export class ContractsController extends Controller {
	@Get()
	public async getAllContracts(): Promise<Contract[]> {
		const rawContracts = await db.contract.findMany({
			include: {
				user: {
					include: {
						person: true
					}
				},
				monetaryValue: true,
				client: {
					include: {
						person: true
					}
				},
				contractComments: {
					include: {
						comment: true
					}
				},
				contractFiles: {
					include: {
						file: true
					}
				},
				contractLevels: {
					include: {
						level: true
					}
				}
			}
		});

		const contracts: Contract[] = rawContracts.map((rc) => ({
			id: rc.id,
			isDone: rc.isDone,
			code: rc.code,
			deadlineAt: rc.deadlineAt,
			description: rc.description ?? undefined,
			startAt: rc.startAt,
			name: rc.name,
			comments: [],
			files: [],
			levels: [],
			subcontracts: [],
			price: {
				createdAt: rc.monetaryValue.createdAt,
				amount: rc.monetaryValue.amount,
				currency: rc.monetaryValue.currencyCode
			},
			responsibleUser: {
				id: rc.responsibleUserId,
				username: rc.user.username,
				name: rc.user.person.name
			},
			client: { id: rc.client.id, name: rc.client.person.name }
		}));

		return contracts;
	}
}
