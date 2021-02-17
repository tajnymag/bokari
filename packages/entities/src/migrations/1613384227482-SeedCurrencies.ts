import { MigrationInterface, QueryRunner } from 'typeorm';
import { Currency } from '../entities';
import { CurrenciesSeed } from './seeds/currencies.seed';

export class SeedCurrencies1613384227482 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    	await queryRunner.manager.getRepository(Currency).save(CurrenciesSeed);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    	await queryRunner.manager.getRepository(Currency).remove(CurrenciesSeed);
    }

}
