import { Exclude, Expose, Transform } from 'class-transformer';
import { IsJWT, IsString } from 'class-validator';

import { ToLowercaseAndTrim } from '../../helpers/transformations';

@Exclude()
export class LoginRequest {
	@Expose()
	@Transform(ToLowercaseAndTrim)
	@IsString()
	username!: string;

	@Expose()
	@IsString()
	password!: string;
}

@Exclude()
export class LoginResponse {
	@Expose()
	@IsJWT()
	accessToken!: string;

	@Expose()
	@IsJWT()
	refreshToken!: string;
}

@Exclude()
export class RefreshRequest {
	@Expose()
	@IsJWT()
	refreshToken!: string;
}

@Exclude()
export class RefreshResponse {
	@Expose()
	@IsJWT()
	accessToken!: string;
}
