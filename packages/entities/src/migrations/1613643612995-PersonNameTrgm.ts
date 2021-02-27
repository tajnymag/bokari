import { MigrationInterface, QueryRunner } from 'typeorm';

export class PersonNameTrgm1613643612995 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE INDEX person_name_trgm ON person USING gin (name gin_trgm_ops)`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP INDEX person_name_trgm`);
	}
}
