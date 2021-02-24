import { Permission, Person, User } from '@bokari/entities';
import * as argon2 from 'argon2';
import { plainToClass } from 'class-transformer';
import { merge } from 'lodash';
import {
	Authorized,
	Body,
	CurrentUser,
	Delete,
	Get,
	HttpCode,
	HttpError,
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

import { UserInsertable, UserUpdatable } from './schemas';

@Authorized()
@JsonController('/users')
export class UsersController {
	@Get()
	@Authorized([Permission.USERS_READ])
	@ResponseSchema(User, { isArray: true })
	async getAllUsers(): Promise<User[]> {
		const users = await getRepository(User).find({
			relations: ['groups', 'workLogs', 'person', 'person.contacts']
		});

		return users;
	}

	@Get('/:username')
	@Authorized()
	@ResponseSchema(User)
	async getUserByUsername(
		@Param('username') username: string,
		@CurrentUser() currentUser: CurrentUserPayload
	): Promise<User> {
		await this.checkPermissions(currentUser, username, Permission.GROUPS_READ);

		const user = await getRepository(User).findOneOrFail(
			{ username },
			{ relations: ['groups', 'workLogs', 'person', 'person.contacts'] }
		);

		return user;
	}

	@Post()
	@Authorized([Permission.USERS_WRITE])
	@ResponseSchema(User)
	async createUser(
		@CurrentUser() currentUser: CurrentUserPayload,
		@Body() desiredUser: UserInsertable
	): Promise<User> {
		if (await existsEntity(User, { username: desiredUser.username })) {
			throw new HttpError(409, 'A user with such username already exists!');
		}

		const passwordHash = await argon2.hash(desiredUser.password);

		const userEntity = plainToClass(User, desiredUser);
		userEntity.passwordHash = passwordHash;

		const createdUser = await getRepository(User).save(userEntity);

		return createdUser;
	}

	@Patch('/:username')
	@Authorized([Permission.USERS_WRITE])
	@ResponseSchema(User)
	async editUser(
		@Param('username') username: string,
		@CurrentUser() currentUser: CurrentUserPayload,
		@Body() desiredChanges: UserUpdatable
	): Promise<User> {
		if (!(await existsEntity(User, { username }))) {
			throw new NotFoundError('A user with such username does not exist!');
		}

		const userEntity = await getRepository(User).findOneOrFail(
			{ username },
			{ relations: ['person', 'person.contacts'] }
		);
		const updatedUserEntity = merge(userEntity, desiredChanges);

		if (desiredChanges.password) {
			const newPasswordHash = await argon2.hash(desiredChanges.password);
			updatedUserEntity.passwordHash = newPasswordHash;
		}

		return getRepository(User).save(updatedUserEntity);
	}

	@Delete('/:username')
	@Authorized([Permission.USERS_WRITE])
	@HttpCode(204)
	@OnUndefined(204)
	async deleteUserByUsername(@Param('username') username: string) {
		await getRepository(User).softDelete({ username });
	}

	private async checkPermissions(
		currentUser: CurrentUserPayload,
		desiredUsername: string,
		permission: Permission
	) {
		if (currentUser.username !== desiredUsername) {
			const hasPermission = currentUser.permissions.includes(permission);

			if (!hasPermission) {
				throw new UnauthorizedError(
					"You don't have enough privileges to edit someone else's profile!"
				);
			}
		}
	}
}
