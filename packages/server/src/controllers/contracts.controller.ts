import { Controller, Get } from 'tsoa';
import { Contract } from '@bokari/shared';
import { db } from '../common/db';

export class ContractsController extends Controller {
	@Get()
	public async getAllContracts(): Promise<Contract[]> {
		const rawContracts = await db.contract.findMany({
			include: {
				responsibleUser: {
					include: {
						person: true
					}
				},
				price: true,
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
				createdAt: rc.price.createdAt,
				amount: rc.price.amount,
				currency: rc.price.currencyCode
			},
			responsibleUser: {
				id: rc.responsibleUserId,
				username: rc.responsibleUser.username,
				name: rc.responsibleUser.person.name
			},
			client: { id: rc.client.id, name: rc.client.person.name }
		}));

		return contracts;
	}
}
