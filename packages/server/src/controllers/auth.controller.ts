import { Request } from 'express';
import { Body, JsonController, Post, Req } from 'routing-controllers';
import { BadRequest, InternalServerError, Unauthorized } from '@curveball/http-errors';
import * as argon2 from 'argon2';
import { IsJWT, IsString } from 'class-validator';

import { getRepository, Metadata, RefreshToken, User } from '@bokari/database';

import { issueToken, JwtType, verifyToken } from '../common/jwt';

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

@JsonController('/auth')
export class AuthController {
	@Post('/login')
	async login(@Req() request: Request, @Body() credentials: LoginRequest): Promise<LoginResponse> {
		const { username, password } = credentials;

		const user = await getRepository(User).findOne({
			where: { username },
			relations: ['person', 'groups']
		});

		if (!user) {
			throw new Unauthorized('Wrong login credentials!');
		}

		const isCorrectPassword = await argon2.verify(user.passwordHash, password);

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
		const metadataEntity = new Metadata();

		refreshTokenEntity.user = user;
		refreshTokenEntity.ip = request.ip;
		refreshTokenEntity.token = refreshToken;
		refreshTokenEntity.metadata = metadataEntity;
		refreshTokenEntity.metadata.createdBy = user;

		const issuedRefreshToken = await getRepository(RefreshToken).save(refreshTokenEntity);

		if (!issuedRefreshToken) {
			throw new InternalServerError(`Could not save ${username}'s refresh token to the database!`);
		}

		return {
			accessToken,
			refreshToken
		};
	}

	@Post('/refresh')
	async refreshToken(@Body() requestBody: RefreshRequest): Promise<RefreshResponse> {
		const oldRefreshToken = await verifyToken(JwtType.REFRESH, requestBody.refreshToken);

		const user = await getRepository(User).findOne({
			where: { username: oldRefreshToken.user.username }
		});

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
