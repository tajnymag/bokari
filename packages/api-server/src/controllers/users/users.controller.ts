import {
	Authorized,
	Body,
	CurrentUser,
	Get,
	HttpError,
	JsonController,
	NotFoundError,
	Param,
	Patch,
	Post
} from 'routing-controllers';
import * as argon2 from 'argon2';

import { Permission, User } from '@bokari/entities';
import { ResponseSchema } from 'routing-controllers-openapi';
import { UserInsertable, UserUpdatable } from './schemas';
import { getRepository } from 'typeorm';
import { TypeormQuery } from '../../helpers/typing';
import { plainToClass, plainToClassFromExist } from 'class-transformer';
import { CurrentUserPayload } from '../../middlewares';
import { existsEntity } from '../../helpers/entities';

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
	@Authorized([Permission.USERS_READ])
	@ResponseSchema(User)
	async getUserByUsername(@Param('username') username: string): Promise<User> {
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
		@Body() desiredChanges: UserUpdatable
	): Promise<User> {
		if (!(await existsEntity(User, { username }))) {
			throw new NotFoundError('A user with such username does not exist!');
		}

		const userEntity = await getRepository(User).findOneOrFail(
			{ username },
			{ relations: ['person', 'person.contacts'] }
		);
		const updatedUserEntity = plainToClassFromExist(userEntity, desiredChanges);

		if (desiredChanges.password) {
			const newPasswordHash = await argon2.hash(desiredChanges.password);
			updatedUserEntity.passwordHash = newPasswordHash;
		}

		return getRepository(User).save(updatedUserEntity);
	}
}
