import { Controller, Get, Post, Body, Request, Security } from 'tsoa';
import { Contract } from '@bokari/shared';
import { ContractWhereUniqueInput } from '@bokari/database';
import { Forbidden } from '@curveball/http-errors';
import { db } from '../common/db';
import { TsoaRequest } from '../middlewares/authentication';

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
						comment: {
							include: {
								author: {
									include: {
										person: true
									}
								}
							}
						}
					}
				},
				contractFiles: {
					include: {
						file: {
							include: {
								author: {
									include: {
										person: true
									}
								}
							}
						}
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
			comments: rc.contractComments
				.map((rcc) => rcc.comment)
				.map((c) => ({
					id: c.id,
					content: c.content,
					createdAt: c.createdAt,
					updatedAt: c.updatedAt,
					author: {
						id: c.author.id,
						username: c.author.username,
						name: c.author.person.name
					}
				})),
			files: rc.contractFiles
				.map((rcf) => rcf.file)
				.map((f) => ({
					id: f.id,
					filename: f.name,
					url: `/static/${f.hash}`,
					blurHash: f.blurhash ?? undefined,
					createdAt: f.createdAt,
					type: f.type,
					author: {
						id: f.author.id,
						username: f.author.username,
						name: f.author.person.name
					}
				})),
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

	@Security('jwt_access')
	@Post()
	public async createContract(@Body() contract: Contract, @Request() request: TsoaRequest) {
		if (await this.existsContract({ code: contract.code })) {
			throw new Forbidden('A contract with such code already exists!');
		}

		const createdContract = await db.contract.create({
			data: {
				code: contract.code,
				name: contract.name,
				deadlineAt: contract.deadlineAt,
				client: {
					connect: {
						id: contract.client.id
					}
				},
				price: {
					create: {
						amount: contract.price.amount,
						currency: {
							connect: {
								isoCode: contract.price.currency
							}
						}
					}
				},
				responsibleUser: {
					connect: {
						id: contract.responsibleUser.id
					}
				},
				createdById: request.jwt?.user.id
			}
		});
	}

	private async existsContract(query: ContractWhereUniqueInput): Promise<boolean> {
		const foundId = db.contract.findOne({ where: query, select: { id: true } });

		return foundId !== null;
	}
}
