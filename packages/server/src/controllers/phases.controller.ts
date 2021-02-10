import { Authorized, Body, Get, HttpError, JsonController, Post } from 'routing-controllers';
import { getRepository, Phase } from '@bokari/database';

@Authorized()
@JsonController('/phases')
export class PhasesController {
	@Get()
	async getAllPhases(): Promise<Phase[]> {
		const phases = await getRepository(Phase).find();

		return phases;
	}

	@Post()
	async createPhase(@Body() desiredPhase: Phase): Promise<Phase> {
		if (await this.phaseExists({ name: desiredPhase.name })) {
			throw new HttpError(409, 'Such phase already exists!');
		}

		const phaseEntity = new Phase();
		phaseEntity.name = desiredPhase.name;

		const createdEntity = await getRepository(Phase).save(phaseEntity);

		return createdEntity;
	}

	async phaseExists(query: Partial<Phase>): Promise<boolean> {
		return await getRepository(Phase).count({where: query}) > 0;
	}
}
