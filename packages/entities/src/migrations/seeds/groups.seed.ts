import { Group, Metadata, Permission, User } from '../../entities';

import { AdminUserSeed } from './admin-user.seed';

export const GroupsSeed = [
	new Group({
		name: 'Accountants',
		users: [],
		permissions: [Permission.FINANCES_WRITE, Permission.FINANCES_READ]
	}),
	new Group({
		name: 'Admin',
		users: [AdminUserSeed],
		permissions: [
			Permission.USERS_WRITE,
			Permission.USERS_READ,
			Permission.CONTRACTS_WRITE,
			Permission.CONTRACTS_READ,
			Permission.FINANCES_WRITE,
			Permission.FINANCES_READ,
			Permission.GROUPS_WRITE,
			Permission.GROUPS_READ
		]
	}),
	new Group({
		name: 'Employee',
		users: [],
		permissions: [Permission.CONTRACTS_READ]
	})
];
