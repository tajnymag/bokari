import { Body, Controller, Get, Path, Post, Query, Route, SuccessResponse } from 'tsoa';
import { User, UserInsertable } from '@bokari/shared';

import * as UserService from './users.service';

@Route('users')
export class UsersController extends Controller {
	@Get('{userId}')
	public async getUser(@Path() userId: number, @Query() name?: string): Promise<User> {
		return {
			name: 'test',
			permissions: [],
			contacts: [],
			id: 1,
			password: 'test',
			username: 'test',
			wage: {
				id: 1,
				amount: 5,
				createdAt: new Date(),
				currency: 'czk'
			}
		};
	}

	@SuccessResponse('201', 'Created')
	@Post()
	public async createUser(@Body() requestBody: UserInsertable): Promise<User> {
		return UserService.createUser(requestBody);
	}
}
