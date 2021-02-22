import { Person, User } from '../../entities';

export const AdminUserSeed = new User ({
	username: 'admin',
	passwordHash: '$argon2i$v=19$m=16,t=2,p=1$NWtuT3p3eWF2Q3UxSjRkdQ$OiLMvYNsxzMvXW/UcsA0UQ',
	person: new Person({ name: 'Admin' }),
	workLogs: [],
	refreshTokens: [],
	groups: []
});
