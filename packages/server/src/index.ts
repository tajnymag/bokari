require('dotenv').config();

import {isUser, User} from "@bokari/shared";
import {DatabaseClient} from "@bokari/database";

const db = new DatabaseClient();

(async () => {
	await db.address.findOne({where: { id: 1 }});
	const user: any = { password: 'abc' };

	if (isUser(user)) {
		console.log(user.password);
	} else {
		console.log(user.address);
	}
}
)();

