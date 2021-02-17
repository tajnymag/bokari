import * as http from 'http';
import { createTerminus } from '@godaddy/terminus';
import { createConnection, getConnection } from 'typeorm';
import { app } from './app';

export class Server {
	private server!: http.Server;

	async listen(port = 3000, hostname = '0.0.0.0'): Promise<http.Server> {
		this.server = http.createServer(app);

		createTerminus(this.server);

		try {
			await createConnection();
		} catch (err) {
			console.error('Failed to establish a connection to the database. Check your environment variables!');
			console.error(err);
			process.exit(1);
		}

		try {
			await getConnection().runMigrations();
		} catch (err) {
			console.error('Failed to run migrations')
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
