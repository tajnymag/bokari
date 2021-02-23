import * as http from 'http';

import * as entities from '@bokari/entities/dist/cjs/entities';
import * as migrations from '@bokari/entities/dist/cjs/migrations';
import { createTerminus } from '@godaddy/terminus';
import { createConnection, getConnection, getConnectionOptions } from 'typeorm';

import { app } from './app';
import { PORT } from './env.config';

export class Server {
	private server!: http.Server;

	async listen(port = PORT, hostname = '0.0.0.0'): Promise<http.Server> {
		this.server = http.createServer(app);

		createTerminus(this.server);

		try {
			const connectionOptions = await getConnectionOptions();
			Object.assign(connectionOptions, {
				entities: Object.values(entities),
				migrations: Object.values(migrations)
			});
			await createConnection(connectionOptions);
		} catch (err) {
			console.error(
				'Failed to establish a connection to the database. Check your environment variables!'
			);
			console.error(err);
			process.exit(1);
		}

		try {
			await getConnection().runMigrations();
		} catch (err) {
			console.error('Failed to run migrations');
			process.exit(1);
		}

		return new Promise(resolve => {
			this.server.listen(port, hostname, () => {
				resolve(this.server);
			});
		});
	}
}

export const server = new Server();
