import { Group, Permission } from '../../entities';

export const GroupsSeed: Pick<Group, 'name' | 'permissions'>[] = [
	{ name: 'Accountants', permissions: [Permission.FINANCES_WRITE, Permission.FINANCES_READ] },
	{
		name: 'Admin',
		permissions: [
			Permission.USERS_WRITE,
			Permission.USERS_READ,
			Permission.CONTRACTS_WRITE,
			Permission.CONTRACTS_READ,
			Permission.FINANCES_WRITE,
			Permission.FINANCES_READ
		]
	},
	{ name: 'Employee', permissions: [Permission.CONTRACTS_READ] }
];
