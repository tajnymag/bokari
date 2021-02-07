import { createConnection } from 'typeorm';

export type SUPPORTED_DBMS = 'postgres' | 'mysql' | 'mariadb';

const TYPEORM_HOST: string = process.env.TYPEORM_HOST ?? '::1';
const TYPEORM_USERNAME: string = process.env.TYPEORM_USERNAME ?? 'postgres';
const TYPEORM_PASSWORD: string = process.env.TYPEORM_PASSWORD ?? 'postgres';
const TYPEORM_DATABASE: string = process.env.TYPEORM_DATABASE ?? 'postgres';
const TYPEORM_SCHEMA: string = process.env.TYPEORM_SCHEMA ?? 'public';

const TYPEORM_PORT: number = parseInt(process.env.TYPEORM_PORT ?? String(5432));

const TYPEORM_CONNECTION: SUPPORTED_DBMS =
	(process.env.TYPEORM_CONNECTION as SUPPORTED_DBMS) ?? 'postgres';
const TYPEORM_SYNCHRONIZE: boolean = ['true', '1'].includes(
	String(process.env.TYPEORM_SYNCHRONIZE ?? 'true').toLowerCase()
);
const TYPEORM_LOGGING: boolean = ['true', '1'].includes(
	String(process.env.TYPEORM_LOGGING ?? 'false').toLowerCase()
);

export async function connectToDatabase() {
	const connection = await createConnection({
		type: TYPEORM_CONNECTION,
		host: TYPEORM_HOST,
		username: TYPEORM_USERNAME,
		password: TYPEORM_PASSWORD,
		port: TYPEORM_PORT,
		database: TYPEORM_DATABASE,
		schema: TYPEORM_SCHEMA,
		synchronize: TYPEORM_SYNCHRONIZE,
		logging: TYPEORM_LOGGING,
		entities: [__dirname + '/entities/*.js']
	});

	return connection;
}
