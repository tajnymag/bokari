import {PrismaClient} from '@prisma/client';
import {validateOrReject} from 'class-validator';
import {User} from "@bokari/types";

const prisma = new PrismaClient();

(async () => {
	const user = new User();
	Object.assign(user, { password: 'abc' })

	try {
		await validateOrReject(user);
	} catch(err) {
		console.dir(err);
	}
}
)();

