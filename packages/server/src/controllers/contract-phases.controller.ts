import {
	Authorized,
	BadRequestError,
	Body,
	Delete,
	JsonController,
	Param,
	Put
} from 'routing-controllers';
import { Contract, ContractPhase, getManager, getRepository, Permission } from '@bokari/database';
import { validateSync } from 'class-validator';

@JsonController('/contracts/:code/phases')
export class ContractPhasesController {
	@Put()
	@Authorized([Permission.CONTRACTS_WRITE])
	async editContractPhases(
		@Param('code') code: string,
		@Body({ type: ContractPhase })
		desiredPhases: ContractPhase[]
	): Promise<ContractPhase[]> {
		if (
			!Array.isArray(desiredPhases) ||
			desiredPhases.some(dp => validateSync(dp).length > 0)
		) {
			throw new BadRequestError(
				'The request body is not a valid list of contract-phase mappings!'
			);
		}

		const contract = await getRepository(Contract).findOneOrFail({ where: { code } });

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
	async removeContractPhase(@Param('id') id: number) {
		return getRepository(ContractPhase).delete(id);
	}
}
