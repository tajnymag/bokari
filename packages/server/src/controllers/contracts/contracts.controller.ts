import { Request } from 'express';
import {
	Authorized,
	Body,
	CurrentUser,
	Get,
	HttpCode,
	HttpError,
	JsonController,
	Param,
	Patch,
	Post,
	Req
} from 'routing-controllers';

import { Contract, Metadata, Permission, User } from '@bokari/entities';
import { ContractInsertable, ContractUpdatable } from './schemas';
import { ResponseSchema } from 'routing-controllers-openapi';
import { TypeormQuery } from '../../helpers/typing';
import { getRepository, Like } from 'typeorm';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { CurrentUserPayload } from '../../middlewares';
import { existsEntity } from '../../helpers/entities';

@Authorized()
@JsonController('/contracts')
export class ContractsController {
	@Get()
	@Authorized([Permission.CONTRACTS_READ])
	@ResponseSchema(Contract, { isArray: true })
	async getAllContracts(): Promise<Contract[]> {
		const contracts = await getRepository(Contract).find();

		return contracts;
	}

	@Get('/:code')
	@Authorized([Permission.CONTRACTS_READ])
	@ResponseSchema(Contract)
	async getContractByCode(@Param('code') code: string): Promise<Contract> {
		const contract = await getRepository(Contract).findOneOrFail({
			where: { code },
			relations: ['attachments', 'metadata.createdBy']
		});

		return contract;
	}

	@Post()
	@Authorized([Permission.CONTRACTS_WRITE])
	@HttpCode(201)
	@ResponseSchema(Contract, { statusCode: 201 })
	async createContract(
		@CurrentUser() currentUser: CurrentUserPayload,
		@Body() desiredContract: ContractInsertable,
		@Req() request: Request
	): Promise<Contract> {
		if (await existsEntity(Contract,{ code: desiredContract.code })) {
			throw new HttpError(409, 'A contract with such code already exists!');
		}

		const contractEntity = plainToClass(Contract, desiredContract);
		contractEntity.metadata = new Metadata({ createdBy: currentUser });
		contractEntity.code = desiredContract.code ?? await this.nextContractCode();

		const createdContract = await getRepository(Contract).save(contractEntity);

		return createdContract;
	}

	@Patch('/:code')
	@Authorized([Permission.CONTRACTS_WRITE])
	@ResponseSchema(Contract)
	async editContract(
		@Param('code') code: string,
		@Body() desiredChanges: ContractUpdatable
	): Promise<Contract> {

		const contractEntity = await getRepository(Contract).findOneOrFail({ code });
		const updatedEntity = plainToClassFromExist(contractEntity, desiredChanges);

		const updatedContract = await getRepository(Contract).save(updatedEntity);

		return updatedContract;
	}

	private async nextContractCode(): Promise<string> {
		const thisYearPrefix = (new Date()).getFullYear().toString().substr(2, 2);
		const numberOfContractsWithThisPrefix = await getRepository(Contract).count({ code: Like(`${thisYearPrefix}%`) });

		let potentialPostfix = numberOfContractsWithThisPrefix + 1;

		while (potentialPostfix < 1000 && await existsEntity(Contract, { code: Like(`${thisYearPrefix}${potentialPostfix}`) })) {
			potentialPostfix += 1;
		}

		return `${thisYearPrefix}${potentialPostfix.toString().padStart(3, '0')}`;
	}
}
