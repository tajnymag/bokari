import * as http from 'http';
import { AddressInfo } from 'net';
import { createTerminus } from '@godaddy/terminus';
import { app } from './app';

export class Server {
	private server: http.Server | undefined;

	onListening: (address: AddressInfo | string | null | undefined) => void = () => {};

	listen(port = 3000, hostname = '0.0.0.0'): http.Server {
		this.server = http.createServer(app);

		createTerminus(this.server);

		return this.server.listen(port, hostname, () => {
			this.onListening(this.server?.address());
		});
	}
}

export const server = new Server();
