import { Contract, Metadata, Permission } from '@bokari/entities';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { isNotEmptyObject } from 'class-validator';
import { Request } from 'express';
import { merge } from 'lodash';
import {
  Authorized,
  Body,
  CurrentUser,
  Delete,
  Get,
  HttpCode,
  HttpError,
  JsonController, OnUndefined,
  Param,
  Patch,
  Post,
  QueryParams,
  Req
} from "routing-controllers";
import { ResponseSchema } from 'routing-controllers-openapi';
import { FindManyOptions, FindOneOptions, getRepository, Like, SelectQueryBuilder } from 'typeorm';

import { existsEntity } from '../../helpers/entities';
import { isEmptyObject } from '../../helpers/utils';
import { CurrentUserPayload } from '../../middlewares';

import {
	ContractInsertable,
	ContractsQueryFilterable,
	ContractsQueryParams,
	ContractUpdatable
} from './schemas';

@Authorized()
@JsonController('/contracts')
export class ContractsController {
	@Get()
	@Authorized([Permission.CONTRACTS_READ])
	@ResponseSchema(Contract, { isArray: true })
	async getAllContracts(@QueryParams() query?: ContractsQueryParams): Promise<Contract[]> {
		if (!query || isEmptyObject(query)) {
			return getRepository(Contract).find();
		}

		const limit = query.limit && query.limit >= 0 ? query.limit : 100;
		const page = query.page || 1;
		const searchLike = `%${query.search}%`;
		const orderBy = query.orderBy || 'code';

		const take = limit;
		const skip = (page - 1) * limit;
		const order: FindOneOptions<Contract>['order'] = {};
		order[orderBy] = query.order || 'DESC';

		const whereQuery = (
			qb: SelectQueryBuilder<Contract>
		): void => {
			if (query.search) {
				qb.where('Contract.code = :search', { search: query.search })
					.orWhere('Contract.name ILIKE :searchLike', { searchLike })
					.orWhere('Contract_customer_person.name ILIKE :searchLike', {
						searchLike
					});
			}

			const filterable: (keyof ContractsQueryFilterable)[] = ['deadlineAt', 'startAt'];

			for (const filterProperty of filterable) {
				if (
					query.filterMax &&
					isNotEmptyObject(query.filterMax) &&
					filterProperty in query.filterMax
				) {
					qb.andWhere(`Contract.${filterable} <= :value`, {
						value: query.filterMax[filterProperty]
					});
				}

        if (
          query.filterMin &&
          isNotEmptyObject(query.filterMin) &&
          filterProperty in query.filterMin
        ) {
          qb.andWhere(`Contract.${filterable} >= :value`, {
            value: query.filterMin[filterProperty]
          });
        }
			}
		};

		const contracts = await getRepository(Contract).find({
			where: (qb: SelectQueryBuilder<Contract>) => whereQuery(qb),
			take,
			skip,
			order
		});

		return contracts;
	}

	@Get('/:code')
	@Authorized([Permission.CONTRACTS_READ])
	@ResponseSchema(Contract)
	async getContractByCode(@Param('code') code: string): Promise<Contract> {
		const contract = await getRepository(Contract).findOneOrFail({
			where: { code },
			relations: ['attachments', 'metadata.createdBy', 'attachments.metadata.createdBy']
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
		if (await existsEntity(Contract, { code: desiredContract.code })) {
			throw new HttpError(409, 'A contract with such code already exists!');
		}

		const contractEntity = plainToClass(Contract, desiredContract);
		contractEntity.metadata = new Metadata({ createdBy: currentUser });
		contractEntity.code = desiredContract.code || (await this.nextContractCode());

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
		const updatedEntity = merge(contractEntity, desiredChanges);

		const updatedContract = await getRepository(Contract).save(updatedEntity);

		return updatedContract;
	}

	@Delete('/:code')
	@Authorized([Permission.CONTRACTS_WRITE])
	@OnUndefined(204)
	async deleteContractByCode(@Param('code') code: string) {
		await getRepository(Contract).softDelete({ code });
	}

	private async nextContractCode(): Promise<string> {
		const thisYearPrefix = new Date()
			.getFullYear()
			.toString()
			.substr(2, 2);
		const numberOfContractsWithThisPrefix = await getRepository(Contract).count({
			code: Like(`${thisYearPrefix}%`)
		});

		let potentialPostfix = numberOfContractsWithThisPrefix + 1;

		while (
			potentialPostfix < 1000 &&
			(await existsEntity(Contract, { code: Like(`${thisYearPrefix}${potentialPostfix}`) }))
		) {
			potentialPostfix += 1;
		}

		return `${thisYearPrefix}${potentialPostfix.toString().padStart(3, '0')}`;
	}
}
