import { Contact, Permission, Person, User } from '@bokari/entities';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { merge } from 'lodash';
import {
	Authorized,
	Body,
	CurrentUser,
	Delete,
	HttpCode,
	JsonController,
	NotFoundError,
	OnUndefined,
	Param,
	Patch,
	Post,
	UnauthorizedError
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { getRepository } from 'typeorm';

import { existsEntity } from '../../helpers/entities';
import { CurrentUserPayload } from '../../middlewares';

import { ContactInsertable, ContactUpdatable, PersonUpdatable } from './schemas';

@JsonController('/people')
@Authorized()
export class PeopleController {
	@Patch('/:personId')
	@ResponseSchema(Person)
	async editPerson(
		@CurrentUser() currentUser: CurrentUserPayload,
		@Param('personId') personId: number,
		@Body() desiredChanges: PersonUpdatable
	) {
		if (!(await existsEntity(Person, { id: personId }))) {
			throw new NotFoundError('Such person does not exist!');
		}

		await this.checkPermissions(currentUser, personId);

		const personEntity = await getRepository(Person).findOneOrFail(
			{ id: personId },
			{ relations: ['contacts'] }
		);
		const updatedPersonEntity = merge(personEntity, desiredChanges);

		return getRepository(Person).save(updatedPersonEntity);
	}

	@Post('/:personId')
	@ResponseSchema(Contact)
	async createContact(
		@CurrentUser() currentUser: CurrentUserPayload,
		@Param('personId') personId: number,
		@Body() desiredContact: ContactInsertable
	): Promise<Contact> {
		if (!(await existsEntity(Person, { id: personId }))) {
			throw new NotFoundError('Such person does not exist!');
		}

		await this.checkPermissions(currentUser, personId);

		const contactEntity = plainToClass(Contact, desiredContact);
		contactEntity.person = new Person({ id: personId });

		return getRepository(Contact).save(contactEntity);
	}

	@Patch('/:personId/:contactId')
	@ResponseSchema(Contact)
	async editContact(
		@CurrentUser() currentUser: CurrentUserPayload,
		@Param('personId') personId: number,
		@Param('contactId') contactId: number,
		@Body() desiredChanges: ContactUpdatable
	): Promise<Contact> {
		if (!(await existsEntity(Contact, { id: contactId }))) {
			throw new NotFoundError('Such contact does not exist!');
		}

		await this.checkPermissions(currentUser, personId);

		const contactEntity = await getRepository(Contact).findOneOrFail({ id: contactId });
		const updatedEntity = merge(contactEntity, desiredChanges);

		return getRepository(Contact).save(updatedEntity);
	}

	@Delete('/:personId/:contactId')
	@OnUndefined(204)
	async deleteContact(
		@CurrentUser() currentUser: CurrentUserPayload,
		@Param('personId') personId: number,
		@Param('contactId') contactId: number
	): Promise<void> {
		await this.checkPermissions(currentUser, personId);

		await getRepository(Contact).delete(contactId);
	}

	private async checkPermissions(currentUser: CurrentUserPayload, desiredPersonId: number) {
		const isUser = await existsEntity(User, { person: { id: desiredPersonId } });
		const currentPerson = await getRepository(Person).findOneOrFail({ id: currentUser.id });

		if (isUser && currentPerson.id !== desiredPersonId) {
			const hasUserWritePermissions = currentUser.permissions.includes(Permission.USERS_WRITE);

			if (!hasUserWritePermissions) {
				throw new UnauthorizedError(
					"You don't have enough privileges to edit someone else's profile!"
				);
			}
		}
	}
}
