import { Body, Controller, Get, Path, Post, Query, Route, SuccessResponse } from 'tsoa';
import { User } from '@bokari/shared';

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

	@SuccessResponse('201', 'Created') // Custom success response
	@Post()
	public async createUser(@Body() requestBody: Pick<User, 'name'>): Promise<void> {
		this.setStatus(201); // set return status 201
		return;
	}
}
