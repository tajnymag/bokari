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
	BadRequestError
} from 'routing-controllers';

import {
	Contract,
	ContractAttachment,
	Customer,
	getRepository,
	Metadata,
	Permission,
	User
} from '@bokari/database';

@JsonController('/contracts')
export class ContractsController {
	@Get()
	@Authorized([Permission.CONTRACTS_READ])
	async getAllContracts() {
		const contracts = await getRepository(Contract).find({
			relations: ['customer', 'contractPhases']
		});

		return contracts;
	}

	@Get('/:code')
	@Authorized([Permission.CONTRACTS_READ])
	async getContractByCode(@Param('code') code: string): Promise<Contract> {
		const contract = await getRepository(Contract).findOneOrFail({
			where: { code },
			relations: ['attachments', 'contractPhases', 'customer']
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

	@Post('/:code/attachments')
	@Authorized()
	async createContractAttachment(
		@CurrentUser() currentUser: User,
		@Param('code') code: string,
		@Body() desiredAttachment: ContractAttachment
	): Promise<ContractAttachment> {
		const contractEntity = await getRepository(Contract).findOneOrFail({
			where: { code },
			select: ['id']
		});

		const attachmentEntity = new ContractAttachment();
		attachmentEntity.metadata = new Metadata({ createdBy: currentUser });
		attachmentEntity.contract = contractEntity;
		attachmentEntity.file = desiredAttachment.file;
		attachmentEntity.note = desiredAttachment.note;

		const createdAttachment = await getRepository(ContractAttachment).save(attachmentEntity);

		return createdAttachment;
	}

	async existsContract(query: Partial<Contract>): Promise<boolean> {
		return (await getRepository(Contract).count({ where: query })) > 0;
	}
}
