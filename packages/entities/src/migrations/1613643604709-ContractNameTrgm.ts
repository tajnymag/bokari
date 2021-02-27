import { MigrationInterface, QueryRunner } from 'typeorm';

export class ContractNameTrgm1613643604709 implements MigrationInterface {
	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(
			`CREATE INDEX contract_name_trgm ON contract USING gin (name gin_trgm_ops)`
		);
	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.query(`DROP INDEX contract_name_trgm`);
	}
}
