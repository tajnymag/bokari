import * as http from 'http';
import { createTerminus } from '@godaddy/terminus';
import { createConnection } from 'typeorm';
import { app } from './app';

export class Server {
	private server!: http.Server;

	async listen(port = 3000, hostname = '0.0.0.0'): Promise<http.Server> {
		this.server = http.createServer(app);

		createTerminus(this.server);

		await createConnection();

		return new Promise(resolve => {
			this.server.listen(port, hostname, () => {
				resolve(this.server);
			});
		});
	}
}

export const server = new Server();
