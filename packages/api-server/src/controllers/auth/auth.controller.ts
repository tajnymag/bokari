import { Metadata, RefreshToken, User } from '@bokari/entities';
import * as argon2 from 'argon2';
import { Request } from 'express';
import {
	Body,
	InternalServerError,
	JsonController,
	Post,
	Req,
	UnauthorizedError
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { getRepository } from 'typeorm';

import { issueToken, JwtType, verifyToken } from '../../common/jwt';
import { dedupe } from '../../helpers/utils';

import { LoginRequest, LoginResponse, RefreshRequest, RefreshResponse } from './schemas';

@JsonController('/auth')
export class AuthController {
	@Post('/login')
	@ResponseSchema(LoginResponse)
	async login(
		@Req() request: Request,
		@Body() credentials: LoginRequest
	): Promise<LoginResponse> {
		const { username, password } = credentials;

		const user = await getRepository(User).findOne({
			where: { username },
			relations: ['groups']
		});

		if (!user) {
			throw new UnauthorizedError('Wrong login credentials!');
		}

		const isCorrectPassword = await argon2.verify(user.passwordHash, password);

		if (!isCorrectPassword) {
			throw new UnauthorizedError('Wrong login credentials!');
		}

		const permissions = dedupe(user.groups.flatMap(group => group.permissions));

		const accessToken = await issueToken(
			{
				type: JwtType.ACCESS,
				user: { id: user.id, username: user.username },
				scopes: permissions
			},
			{ expiresIn: '15m' }
		);
		const refreshToken = await issueToken(
			{ type: JwtType.REFRESH, user: { id: user.id, username: user.username } },
			{ expiresIn: '7d' }
		);

		const refreshTokenEntity = new RefreshToken();

		refreshTokenEntity.user = user;
		refreshTokenEntity.ip = request.ip;
		refreshTokenEntity.token = refreshToken;
		refreshTokenEntity.metadata = new Metadata({ createdBy: user });

		try {
			 await getRepository(RefreshToken).save(refreshTokenEntity);
		} catch {
			throw new InternalServerError(
				`Could not save ${username}'s refresh token to the database!`
			);
		}

		return {
			accessToken,
			refreshToken
		};
	}

	@Post('/refresh')
	@ResponseSchema(RefreshResponse)
	async refreshToken(@Body() requestBody: RefreshRequest): Promise<RefreshResponse> {
		const oldRefreshToken = await verifyToken(JwtType.REFRESH, requestBody.refreshToken);

		const { username } = oldRefreshToken.user;

		const user = await getRepository(User).findOne({ username }, { relations: ['groups'] });

		if (!user) {
			throw new UnauthorizedError('The user could not be found in the database!');
		}

		const permissions = dedupe(user.groups.flatMap(group => group.permissions));

		const newAccessToken = await issueToken(
			{
				type: JwtType.ACCESS,
				user: { id: user.id, username: user.username },
				scopes: permissions
			},
			{ expiresIn: '15m' }
		);

		return {
			accessToken: newAccessToken
		};
	}
}
