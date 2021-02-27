import { In, MigrationInterface, QueryRunner } from 'typeorm';

import { Group, Metadata, User } from '../entities';

import { AdminUserSeed } from './seeds/admin-user.seed';
import { GroupsSeed } from './seeds/groups.seed';

export class SeedGroups1613643641329 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		const adminUser = await queryRunner.manager
			.getRepository(User)
			.findOneOrFail({ username: AdminUserSeed.username });

		for (const groupSeed of GroupsSeed) {
			if (!groupSeed.metadata) {
				groupSeed.metadata = new Metadata({ createdBy: adminUser });
			}
		}

		await queryRunner.manager.getRepository(Group).save(GroupsSeed);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.manager
			.getRepository(Group)
			.delete({ name: In(GroupsSeed.map(g => g.name)) });
	}
}
