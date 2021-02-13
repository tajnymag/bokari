import 'reflect-metadata';
import dotenv from 'dotenv';
import { server } from './server';

dotenv.config();

server.listen().then(s => {
	console.log(s.address());
});
