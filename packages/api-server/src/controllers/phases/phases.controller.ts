import { Phase } from '@bokari/entities';
import { plainToClass } from 'class-transformer';
import {
	Authorized,
	Body,
	Get,
	HttpCode,
	HttpError,
	JsonController,
	Post
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { getRepository } from 'typeorm';

import { existsEntity } from '../../helpers/entities';
import { TypeormQuery } from '../../helpers/typing';

import { PhaseInsertable } from './schemas';

@Authorized()
@JsonController('/phases')
export class PhasesController {
	@Get()
	@ResponseSchema(Phase, { isArray: true })
	async getAllPhases(): Promise<Phase[]> {
		const phases = await getRepository(Phase).find();

		return phases;
	}

	@Post()
	@HttpCode(201)
	@ResponseSchema(Phase, { statusCode: 201 })
	async createPhase(@Body() desiredPhase: PhaseInsertable): Promise<Phase> {
		if (await existsEntity(Phase, { name: desiredPhase.name })) {
			throw new HttpError(409, 'Such phase already exists!');
		}

		const phaseEntity = plainToClass(Phase, desiredPhase);

		const createdEntity = await getRepository(Phase).save(phaseEntity);

		return createdEntity;
	}
}
