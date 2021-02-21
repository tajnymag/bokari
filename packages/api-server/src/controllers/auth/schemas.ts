import { Expose, Transform } from 'class-transformer';
import { IsJWT, IsString } from 'class-validator';

import { ToLowercaseAndTrim } from '../../helpers/transformations';

@Expose()
export class LoginRequest {
	@Transform(ToLowercaseAndTrim)
	@IsString()
	username!: string;
	@IsString()
	password!: string;
}

@Expose()
export class LoginResponse {
	@IsJWT()
	accessToken!: string;
	@IsJWT()
	refreshToken!: string;
}

@Expose()
export class RefreshRequest {
	@IsJWT()
	refreshToken!: string;
}

@Expose()
export class RefreshResponse {
	@IsJWT()
	accessToken!: string;
}
