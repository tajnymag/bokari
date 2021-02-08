import { Authorized, Body, CurrentUser, Get, HttpError, JsonController, Param, Post } from 'routing-controllers';
import * as argon2 from 'argon2';
import { IsEmpty, IsString } from 'class-validator';

import { getRepository, Permission, User } from '@bokari/database';

class UserInsertable extends User {
	@IsString()
	password!: string;

	@IsEmpty()
	passwordHash!: string;
}

@JsonController('/users')
export class UsersController {
	@Get()
	@Authorized([Permission.USERS_READ])
	async getAllUsers(): Promise<User[]> {
		const users = await getRepository(User).find({
			relations: ['person', 'groups', 'avatar', 'workLogs']
		});

		return users;
	}

	@Get('/:username')
	@Authorized([Permission.USERS_READ])
	async getUserByUsername(@Param('username') username: string): Promise<User> {
		const user = await getRepository(User).findOneOrFail({
			where: { username },
			relations: ['person', 'groups', 'avatar', 'workLogs']
		});

		return user;
	}

	@Post()
	@Authorized([Permission.USERS_WRITE])
	async createUser(@CurrentUser() currentUser: User, @Body() desiredUser: UserInsertable): Promise<User> {
		if ((await getRepository(User).count({ where: { username: desiredUser.username } })) > 0) {
			throw new HttpError(409, 'A user with such username already exists!');
		}

		const passwordHash = await argon2.hash(desiredUser.password);

		const userEntity = new User();

		userEntity.username = desiredUser.username;
		userEntity.passwordHash = passwordHash;
		userEntity.groups = desiredUser.groups;
		userEntity.avatar = desiredUser.avatar;
		userEntity.person = desiredUser.person;

		const createdUser = await getRepository(User).save(userEntity);

		return createdUser;
	}
}
