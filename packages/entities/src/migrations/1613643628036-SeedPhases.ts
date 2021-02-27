import { In, MigrationInterface, QueryRunner } from 'typeorm';

import { Phase } from '../entities';

import { PhasesSeed } from './seeds/phases.seed';

export class SeedPhases1613643628036 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager.getRepository(Phase).save(PhasesSeed);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager
			.getRepository(Phase)
			.delete({ name: In(PhasesSeed.map(p => p.name)) });
	}
}
