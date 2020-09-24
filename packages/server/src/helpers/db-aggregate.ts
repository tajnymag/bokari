import { Address, Contact, User, MonetaryValue, Permission } from '@bokari/shared';
import {
	Address as AddressPayload,
	ContactGetPayload,
	UserGetPayload,
	MonetaryValue as MonetaryValuePayload,
	Permission as PermissionPayload
} from '@bokari/database';
import { query } from 'express';

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
	queryResult: ContactGetPayload<{ include: { address: true } }>
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
	if (!Permission[queryResult.bit]) {
		throw new RangeError(`Unknown permission bit for permission ${JSON.stringify(queryResult)}!`);
	}

	return queryResult.bit as Permission;
}

export function normalizeUserQuery(
	queryResult: UserGetPayload<{
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
		.sort((wa, wb) => wa.createdAt.valueOf() - wb.createdAt.valueOf())
		.map((w) => normalizeMonetaryValueQuery(w.monetaryValue))[0];

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
		wage: wage,
		permissions: permissions,
		contacts: contacts
	};
}
