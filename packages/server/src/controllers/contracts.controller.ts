import { Request } from 'express';
import {
	JsonController,
	Get,
	Post,
	Body,
	Authorized,
	Req,
	CurrentUser,
	Param,
	HttpError,
	BadRequestError,
} from 'routing-controllers';

import {
	Contract,
	getRepository,
	Metadata,
	Permission,
	User,
} from '@bokari/database';

@Authorized()
@JsonController('/contracts')
export class ContractsController {
	@Get()
	@Authorized([Permission.CONTRACTS_READ])
	async getAllContracts() {
		const contracts = await getRepository(Contract).find();

		return contracts;
	}

	@Get('/:code')
	@Authorized([Permission.CONTRACTS_READ])
	async getContractByCode(@Param('code') code: string): Promise<Contract> {
		const contract = await getRepository(Contract).findOneOrFail({
			where: { code },
			relations: ['attachments']
		});

		return contract;
	}

	@Post()
	@Authorized([Permission.CONTRACTS_WRITE])
	async createContract(
		@CurrentUser() currentUser: User,
		@Body() desiredContract: Contract,
		@Req() request: Request
	) {
		if (await this.existsContract({ code: desiredContract.code })) {
			throw new HttpError(409, 'A contract with such code already exists!');
		}

		const contractEntity = new Contract();
		contractEntity.code = desiredContract.code;
		contractEntity.name = desiredContract.name;
		contractEntity.description = desiredContract.description;
		contractEntity.startAt = desiredContract.startAt;
		contractEntity.deadlineAt = desiredContract.deadlineAt;
		contractEntity.contractPhases = desiredContract.contractPhases;
		contractEntity.metadata = new Metadata({ createdBy: currentUser });
		contractEntity.customer = desiredContract.customer;

		try {
			const createdContract = await getRepository(Contract).save(contractEntity);

			return createdContract;
		} catch (e) {
			throw new BadRequestError(
				'Could not persist the desired contract. Check your supplied fields and contact the administrator if the problem persists.'
			);
		}
	}

	async existsContract(query: Partial<Contract>): Promise<boolean> {
		return (await getRepository(Contract).count({ where: query })) > 0;
	}
}
