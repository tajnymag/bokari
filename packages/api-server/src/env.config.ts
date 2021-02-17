import * as env from 'env-var';

export const BOKARI_UPLOADS_STORAGE_DIR: string = env
	.get('BOKARI_UPLOADS_STORAGE_DIR')
	.required()
	.asString();

export const BOKARI_UPLOADS_SERVE_PATH: string = env
	.get('BOKARI_UPLOADS_SERVE_PATH')
	.default('/static/uploads')
	.asString();

export const BOKARI_GENERATE_API_DOCS: boolean = env
	.get('BOKARI_GENERATE_API_DOCS')
	.default('true')
	.asBool();

export const JWT_PRIVATE_KEY: string = env
	.get('JWT_PRIVATE_KEY')
	.required()
	.asString()

export const JWT_PUBLIC_KEY: string = env
	.get('JWT_PUBLIC_KEY')
	.required()
	.asString()
