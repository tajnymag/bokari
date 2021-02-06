import {JsonController, Get, Post, Body, Authorized, Req} from 'routing-controllers';
import { Forbidden } from '@curveball/http-errors';
import { TsoaRequest } from '../middlewares/authentication';
import {Contract, Customer, getRepository, User} from '@bokari/database';

@JsonController("/contracts")
export class ContractsController {
	@Get("")
	public async getAllContracts() {
		const rawContracts = await getRepository(Contract).find();

		const contracts = rawContracts.map((rc) => ({
			id: rc.id,
			isDone: rc.isDone,
			code: rc.code,
			deadlineAt: rc.deadlineAt,
			description: rc.description ?? undefined,
			startAt: rc.startAt,
			name: rc.name,
			attachments: rc.attachments.map(a => ({
				...a,
				file: {
					...a.file,
					url: `/static/${a.file.hash}`
				}
			})),
			contractPhases: rc.contractPhases,
			customer: rc.customer
		}));

		return contracts;
	}

	@Authorized([])
	@Post("")
	public async createContract(@Body() contract: Contract, @Req() request: TsoaRequest) {
		if (await this.existsContract({code: contract.code})) {
			throw new Forbidden('A contract with such code already exists!');
		}

		const contractEntity = new Contract();
		contractEntity.code = contract.code;
		contractEntity.name = contract.name;
		contractEntity.deadlineAt = contract.deadlineAt;
		contractEntity.customer = await getRepository(Customer).findOneOrFail(contract.customer.id);
		contractEntity.metadata.createdBy = await getRepository(User).findOneOrFail(request.jwt?.user.id);

		await getRepository(Contract).save(contractEntity);
	}

	private async existsContract(query: Partial<Contract>): Promise<boolean> {
		try {
			const contract = await getRepository(Contract).findOneOrFail({where: query});

			return true;
		} catch {
			return false;
		}
	}
}
