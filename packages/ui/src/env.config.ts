import { get as getENV } from 'env-var';

export const BOKARI_API_URL = getENV('VUE_APP_BOKARI_API_URL')
	.default(window.location.origin)
	.asUrlString()
	.replace(/\/$/, '');
