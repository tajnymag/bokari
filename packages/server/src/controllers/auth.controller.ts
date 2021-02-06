import {Body, JsonController, Post, Req} from "routing-controllers";
import {BadRequest, InternalServerError, Unauthorized} from '@curveball/http-errors';
import * as argon2 from 'argon2';
import {IsJWT, IsString} from "class-validator";

import {getRepository, RefreshToken, User} from "@bokari/database";

import {TsoaRequest} from '../middlewares/authentication';
import {issueToken, JwtType, verifyToken} from '../common/jwt';

export class LoginRequest {
	@IsString()
	username!: string;
	@IsString()
	password!: string;
}

export class LoginResponse {
	@IsJWT()
	accessToken!: string;
	@IsJWT()
	refreshToken!: string;
}

export class RefreshRequest {
	@IsJWT()
	refreshToken!: string;
}

export class RefreshResponse {
	@IsJWT()
	accessToken!: string;
}

@JsonController('auth')
export class AuthController {
	@Post('login')
	public async login(
		@Req() request: TsoaRequest,
		@Body() requestBody: LoginRequest
	): Promise<LoginResponse> {
		const login = requestBody;

		const user = await getRepository(User).findOne({where: {username: login.username}});

		if (!user) {
			throw new Unauthorized('Wrong login credentials!');
		}

		const isCorrectPassword = await argon2.verify(user.passwordHash, login.password);

		if (!isCorrectPassword) {
			throw new Unauthorized('Wrong login credentials!');
		}

		const permissions = user.groups.flatMap(group => group.permissions);

		const accessToken = await issueToken(
			{ type: JwtType.ACCESS, user: { id: user.id, username: user.username }, scopes: permissions },
			{ expiresIn: '15m' }
		);
		const refreshToken = await issueToken(
			{ type: JwtType.REFRESH, user: { id: user.id, username: user.username } },
			{ expiresIn: '7d' }
		);

		const refreshTokenEntity = new RefreshToken();
		refreshTokenEntity.user = user;
		refreshTokenEntity.ip = request.ip;
		refreshTokenEntity.metadata.createdBy = user;
		refreshTokenEntity.token = refreshToken;

		const issuedRefreshToken = await getRepository(RefreshToken).create(refreshTokenEntity);

		if (!issuedRefreshToken) {
			throw new InternalServerError(`Could not save ${user.username}'s to the database!`);
		}

		return {
			accessToken,
			refreshToken
		};
	}

	@Post('refresh')
	public async refreshToken(@Body() requestBody: RefreshRequest): Promise<RefreshResponse> {
		const oldRefreshToken = await verifyToken(requestBody.refreshToken);

		if (oldRefreshToken.type !== 'refresh') {
			throw new BadRequest('Bad token provided!');
		}

		const user = await getRepository(User).findOne({where: {username: oldRefreshToken.user.username}});

		if (!user) {
			throw new Unauthorized('The user could not be found in the database!');
		}

		const permissions = user.groups.flatMap(group => group.permissions);

		const newAccessToken = await issueToken(
			{ type: JwtType.ACCESS, user: { id: user.id, username: user.username }, scopes: permissions },
			{ expiresIn: '15m' }
		);

		return {
			accessToken: newAccessToken
		};
	}
}
