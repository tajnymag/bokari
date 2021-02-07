import {
	Authorized,
	Body,
	CurrentUser,
	Get, HttpError,
	JsonController,
	Param,
	Post
} from 'routing-controllers';
import { getRepository, Permission, Person, User } from '@bokari/database';
import { classToPlain } from 'class-transformer';
import * as argon2 from 'argon2';
import { IsEmpty, IsString } from 'class-validator';

class UserInsertable extends User {
	@IsEmpty()
	id!: number;

	@IsString()
	password!: string;

	@IsEmpty()
	passwordHash!: string;
}

@JsonController('/users')
export class UsersController {
	@Authorized([Permission.USERS_READ])
	@Get()
	async getAllUsers(): Promise<User[]> {
		const users = await getRepository(User).find();

		return users;
	}

	@Authorized([Permission.USERS_READ])
	@Get('/:username')
	async getUserByUsername(@Param('username') username: string): Promise<User | undefined> {
		const user = await getRepository(User).findOne({ where: { username } });

		return user;
	}

	@Authorized([Permission.USERS_WRITE])
	@Post()
	async createUser(@CurrentUser() currentUser: User, @Body() desiredUser: UserInsertable): Promise<User> {
		if (await getRepository(User).count({where: {username: desiredUser.username}}) > 0) {
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
