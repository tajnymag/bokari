import "reflect-metadata";
import dotenv from 'dotenv';
dotenv.config();

import { server } from './server';

server.listen().then(s => {
	console.log(s.address());
});
