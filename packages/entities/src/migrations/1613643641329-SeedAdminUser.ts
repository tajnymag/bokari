import {MigrationInterface, QueryRunner} from "typeorm";

import { Group, User } from '../entities';

import { AdminUserSeed } from './seeds/admin-user.seed';

export class SeedAdminUser1613643641329 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
	    const adminGroup = await queryRunner.manager
		    .getRepository(Group)
		    .findOneOrFail({ name: 'Admin' });

	    AdminUserSeed.groups = [adminGroup];

	    await queryRunner.manager.getRepository(User).save(AdminUserSeed);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
	    await queryRunner.manager.getRepository(User).delete({ username: AdminUserSeed.username });
    }

}
