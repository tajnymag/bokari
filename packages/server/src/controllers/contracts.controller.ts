import { Request } from 'express';
import {
	JsonController,
	Get,
	Post,
	Body,
	Authorized,
	Req,
	CurrentUser,
	Param
} from 'routing-controllers';
import { Forbidden } from '@curveball/http-errors';
import { Contract, Customer, getRepository, Permission, User } from '@bokari/database';
import { classToPlain } from 'class-transformer';

@JsonController('/contracts')
export class ContractsController {
	@Authorized([Permission.CONTRACTS_READ])
	@Get('')
	async getAllContracts() {
		const rawContracts = await getRepository(Contract).find();

		const contracts = rawContracts.map(rc => ({
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

	@Authorized([Permission.CONTRACTS_READ])
	@Get("/:code")
	async getContractByCode(@Param("code") code: string) {
		const contract = await getRepository(Contract).findOne({where: {code}});

		return contract;
	}

	@Authorized([Permission.CONTRACTS_WRITE])
	@Post('')
	async createContract(
		@CurrentUser() currentUser: User,
		@Body() desiredContract: Contract,
		@Req() request: Request
	) {
		if (await this.existsContract({ code: desiredContract.code })) {
			throw new Forbidden('A contract with such code already exists!');
		}

		const contractEntity = new Contract();
		contractEntity.code = desiredContract.code;
		contractEntity.name = desiredContract.name;
		contractEntity.deadlineAt = desiredContract.deadlineAt;
		contractEntity.customer = await getRepository(Customer).findOneOrFail(desiredContract.customer.id);
		contractEntity.metadata.createdBy = currentUser;

		const createdContract = await getRepository(Contract).save(contractEntity);

		return createdContract;
	}

	async existsContract(query: Partial<Contract>): Promise<boolean> {
		try {
			const contract = await getRepository(Contract).findOneOrFail({ where: query });

			return true;
		} catch {
			return false;
		}
	}
}
