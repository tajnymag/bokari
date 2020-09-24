import { PrismaClient } from '@bokari/database';

export const db = new PrismaClient({
	log: ['query']
});
