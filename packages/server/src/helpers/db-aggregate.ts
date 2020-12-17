import { compareDesc } from 'date-fns';
import { Address, Contact, User, MonetaryValue, Permission } from '@bokari/shared';
import {
	Address as AddressPayload,
	Prisma,
	MonetaryValue as MonetaryValuePayload,
	Permission as PermissionPayload
} from '@bokari/database';

export function normalizeAddressQuery(queryResult: AddressPayload): Address {
	return {
		id: queryResult.id,
		city: queryResult.city,
		country: queryResult.countryCode,
		state: queryResult.state ?? undefined,
		street: queryResult.street,
		zip: queryResult.zip
	};
}

export function normalizeContactQuery(
	queryResult: Prisma.ContactGetPayload<{ include: { address: true } }>
): Contact {
	return {
		id: queryResult.id,
		email: queryResult.email ?? undefined,
		note: queryResult.note ?? undefined,
		phone: queryResult.phone ?? undefined,
		address: queryResult.address ? normalizeAddressQuery(queryResult.address) : undefined
	};
}

export function normalizeMonetaryValueQuery(queryResult: MonetaryValuePayload): MonetaryValue {
	return {
		id: queryResult.id,
		createdAt: queryResult.createdAt,
		currency: queryResult.currencyCode,
		amount: queryResult.amount
	};
}

export function normalizePermissionQuery(queryResult: PermissionPayload): Permission {
	if (!Object.values(Permission).includes(queryResult.name.toLowerCase() as Permission)) {
		throw new RangeError(`Unknown permission name for permission ${JSON.stringify(queryResult)}!`);
	}

	return queryResult.name as Permission;
}

export function normalizeUserQuery(
	queryResult: Prisma.UserGetPayload<{
		include: {
			wages: {
				include: {
					monetaryValue: true;
				};
			};
			person: {
				include: {
					personContacts: {
						include: {
							contact: {
								include: {
									address: true;
								};
							};
						};
					};
				};
			};
			groupUsers: {
				include: {
					group: {
						include: {
							groupPermissions: {
								include: {
									permission: true;
								};
							};
						};
					};
				};
			};
		};
	}>
): User & { passwordHash: string } {
	const wage = queryResult.wages
		.sort((wa, wb) => compareDesc(wa.createdAt, wb.createdAt))
		.map((w) => normalizeMonetaryValueQuery(w.monetaryValue))[0];

	const groups = queryResult.groupUsers.map((gu) => gu.group).map((g) => g.name);

	const permissions = queryResult.groupUsers
		.map((gu) => gu.group)
		.map((g) => g.groupPermissions)
		.flatMap((gp) => gp.map((p) => normalizePermissionQuery(p.permission)));

	const contacts = queryResult.person.personContacts
		.map((pc) => pc.contact)
		.map(normalizeContactQuery);

	return {
		id: queryResult.id,
		name: queryResult.person.name,
		username: queryResult.username,
		passwordHash: queryResult.passwordHash,
		groups: groups,
		permissions: [...new Set(permissions)],
		contacts: contacts,
		wage: wage
	};
}
