import { Contract, ContractPhase, Permission } from '@bokari/entities';
import {
	Authorized,
	Body,
	Delete,
	HttpCode,
	JsonController,
	Param,
	Put
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { getManager, getRepository } from 'typeorm';

import { ContractPhaseInsertable } from './schemas';

@JsonController('/contracts/:code/phases')
export class ContractPhasesController {
	@Put()
	@Authorized([Permission.CONTRACTS_WRITE])
	@ResponseSchema(ContractPhase, { isArray: true })
	async editContractPhases(
		@Param('code') code: string,
		@Body({
			type: ContractPhaseInsertable
		})
			desiredPhases: ContractPhaseInsertable[]
	): Promise<ContractPhase[]> {
		const contract = await getRepository(Contract).findOneOrFail({
			where: { code },
			select: ['id']
		});

		const phaseEntities = desiredPhases.map(cp => {
			const phaseEntity = new ContractPhase();
			phaseEntity.contractId = contract.id;
			phaseEntity.phaseId = cp.phaseId;
			phaseEntity.deadlineAt = cp.deadlineAt;
			phaseEntity.isDone = cp.isDone;

			return phaseEntity;
		});

		await getManager().transaction(async transaction => {
			await transaction.getRepository(ContractPhase).delete({
				contractId: contract.id
			});
			await transaction.getRepository(ContractPhase).save(phaseEntities);
		});

		return getRepository(ContractPhase).find({ where: { contractId: contract.id } });
	}

	@Delete('/:id')
	@HttpCode(204)
	async removeContractPhase(@Param('id') id: number): Promise<void> {
		await getRepository(ContractPhase).delete(id);
	}
}
