import 'reflect-metadata';
import { config as dotenvConfig } from 'dotenv';
dotenvConfig();

import { server } from './server';

server.listen().then(s => {
	console.log(s.address());
});
