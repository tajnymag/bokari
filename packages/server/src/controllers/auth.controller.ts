import { Body, Controller, Post, Route, Header } from 'tsoa';
import { InternalServerError, Unauthorized } from '@curveball/http-errors';
import * as argon2 from 'argon2';

import { db } from '../common/db';
import { normalizePermissionQuery } from '../helpers/db-aggregate';
import { issueToken, verifyToken, RefreshTokenPayload } from '../common/jwt';

export interface LoginRequest {
	username: string;
	password: string;
}

export interface LoginResponse {
	accessToken: string;
	refreshToken: string;
}

export interface RefreshRequest {
	refreshToken: string;
}

export type RefreshResponse = Pick<LoginResponse, 'accessToken'>;

@Route('auth')
export class AuthController extends Controller {
	@Post('login')
	public async login(@Body() requestBody: LoginRequest): Promise<LoginResponse> {
		const login = requestBody;

		const user = await db.user.findOne({
			where: { username: login.username },
			include: {
				groupUsers: {
					include: {
						group: {
							include: {
								groupPermissions: {
									include: {
										permission: true
									}
								}
							}
						}
					}
				}
			}
		});

		if (!user) {
			throw new Unauthorized('Wrong login credentials!');
		}

		const isCorrectPassword = await argon2.verify(user.passwordHash, login.password);

		if (!isCorrectPassword) {
			throw new Unauthorized('Wrong login credentials!');
		}

		const permissions = user.groupUsers
			.map((gu) => gu.group.groupPermissions)
			.flatMap((gp) => gp.map((p) => normalizePermissionQuery(p.permission)));

		const accessToken = await issueToken(
			{ user: { id: user.id, username: user.username }, scopes: permissions },
			{ expiresIn: '15m' }
		);
		const refreshToken = await issueToken(
			{ user: { id: user.id, username: user.username } },
			{ expiresIn: '7d' }
		);

		const tokenQueryResult = await db.refreshToken.create({
			data: { user: { connect: { id: user.id } }, token: refreshToken }
		});

		if (!tokenQueryResult) {
			throw new InternalServerError(`Could not save ${user.username}'s to the database!`);
		}

		return {
			accessToken,
			refreshToken
		};
	}

	@Post('refresh_token')
	public async refreshToken(@Body() requestBody: RefreshRequest): Promise<RefreshResponse> {
		let oldRefreshToken: RefreshTokenPayload | null = null;

		try {
			oldRefreshToken = await verifyToken(requestBody.refreshToken);
		} catch (e) {
			throw new Unauthorized('Invalid refresh token!');
		}

		const user = await db.user.findOne({
			where: { id: oldRefreshToken.user.id },
			include: {
				groupUsers: {
					include: {
						group: {
							include: {
								groupPermissions: {
									include: {
										permission: true
									}
								}
							}
						}
					}
				}
			}
		});

		if (!user) {
			throw new Unauthorized('The user could not be found in the database!');
		}

		const permissions = user.groupUsers
			.map((gu) => gu.group.groupPermissions)
			.flatMap((gp) => gp.map((p) => normalizePermissionQuery(p.permission)));

		const newAccessToken = await issueToken(
			{ user: { id: user.id, username: user.username }, scopes: permissions },
			{ expiresIn: '15m' }
		);

		const tokenQueryResult = await db.refreshToken.create({
			data: { user: { connect: { id: oldRefreshToken.user.id } }, token: newAccessToken }
		});

		if (!tokenQueryResult) {
			throw new Error('Could not save refresh token to database!');
		}

		return {
			accessToken: newAccessToken
		};
	}
}
