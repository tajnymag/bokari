import { Contract, Group, Permission, Person, User } from '@bokari/shared';

const people: Person[] = [
	{
		id: 1,
		name: 'Marek Lukáš'
	},
	{
		id: 2,
		name: 'Petr Lukáš'
	},
	{
		id: 3,
		name: 'Vlastimil Straka'
	},
	{
		id: 4,
		name: 'Pepa Vomáčka'
	}
];

const groups: Group[] = [
	{
		id: 1,
		name: 'Administrátoři',
		permissions: [
			Permission.USERS_WRITE,
			Permission.USERS_READ,
			Permission.FINANCES_WRITE,
			Permission.FINANCES_READ,
			Permission.CONTRACTS_WRITE,
			Permission.CONTRACTS_READ
		]
	},
	{
		id: 2,
		name: 'Zaměstnanci',
		permissions: [
			Permission.FINANCES_WRITE,
			Permission.FINANCES_READ,
			Permission.CONTRACTS_WRITE,
			Permission.CONTRACTS_READ
		]
	}
];

const users: User[] = [
	{
		...people[0],
		username: 'marek.lukas',
		contacts: [],
		permissions: [...groups[0].permissions]
	},
	{
		...people[1],
		username: 'petr.lukas',
		contacts: [],
		permissions: [...groups[1].permissions]
	},
	{
		...people[2],
		username: 'vlasta.straka',
		contacts: [],
		permissions: [...groups[1].permissions]
	}
];

const contracts: Contract[] = [
	{
		id: 1,
		code: '202001',
		client: people[3],
		comments: [],
		deadlineAt: new Date(),
		description: 'asdasd ada asd',
		files: [],
		isDone: false,
		levels: [
			{
				deadlineAt: new Date(),
				isDone: true,
				name: 'Stavební úřad',
				startAt: new Date()
			},
			{
				deadlineAt: new Date(),
				isDone: false,
				name: 'Stavba',
				startAt: new Date()
			}
		],
		name: 'Testovací zakázka',
		price: {
			amount: 500000,
			createdAt: new Date(),
			currency: 'czk'
		},
		responsibleUser: users[1],
		startAt: new Date(),
		subcontracts: []
	},
	{
		id: 2,
		code: '201906',
		client: people[3],
		comments: [],
		deadlineAt: new Date(-10000),
		description: 'asdasd ada asd',
		files: [],
		isDone: true,
		levels: [
			{
				deadlineAt: new Date(),
				isDone: false,
				name: 'Stavební úřad',
				startAt: new Date()
			}
		],
		name: 'Jiná zakázka',
		price: {
			amount: 500000,
			createdAt: new Date(),
			currency: 'czk'
		},
		responsibleUser: users[2],
		startAt: new Date(-1),
		subcontracts: []
	}
];

export function getAllContracts() {
	return contracts;
}

export function getContractById(id: number) {
	return contracts.find((c) => c.id === id);
}

export function getAllUsers() {
	return users;
}

export function getUserById(id: number) {
	return users.find((u) => u.id === id);
}
