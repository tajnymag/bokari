import { Controller, Post, Route } from 'tsoa';

@Route('auth')
export class AuthController extends Controller {
	@Post('login')
	public async login() {}
}
