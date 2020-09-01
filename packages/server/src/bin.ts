import dotenv from 'dotenv';
dotenv.config();

import { server } from './server';

server.onListening = (address) => console.log(address);
server.listen();
