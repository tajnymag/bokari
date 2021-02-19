import { In, MigrationInterface, QueryRunner } from 'typeorm';
import { Group } from '../entities';
import { GroupsSeed } from './seeds/groups.seed';

export class SeedGroups1613643634132 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
	    await queryRunner.manager.getRepository(Group).save(GroupsSeed);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
	    await queryRunner.manager
		    .getRepository(Group)
		    .delete({ name: In(GroupsSeed.map(g => g.name)) });
    }

}
