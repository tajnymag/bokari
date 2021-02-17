import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { authAPIClient } from '@/http/api';
import { router } from '@/router';
import { useToastStore } from '@/stores/toast.store';

const ACCESS_TOKEN_STORAGE_KEY = 'accessToken';
const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken';

export function saveAccessToken(token: string) {
	sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
}

export function getAccessToken() {
	return sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
}

export function saveRefreshToken(token: string) {
	localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, token);
}

export function getRefreshToken() {
	return localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function resetTokens() {
	sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
	localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY);
}

export function injectAccessTokenInterceptor(request: AxiosRequestConfig): AxiosRequestConfig {
	if (getAccessToken()) {
		request.headers.Authorization = `Bearer ${getAccessToken()}`;
	}
	return request;
}

export async function refreshAccessTokenLogic(failedRequest: AxiosResponse): Promise<void> {
	const refreshToken = getRefreshToken();

	try {
		const res = await authAPIClient.refreshToken({ refreshToken: refreshToken as string });

		saveAccessToken(res.data.accessToken);
		failedRequest.config = injectAccessTokenInterceptor(failedRequest.config);
	} catch (err) {
		useToastStore().showToast({
			message:
				'Je požadováno opětovné přihlášení. Nyní budete přesměrování na stranu s přihlášením.',
			type: 'warning',
			timeout: 2000
		});
		setTimeout(() => router.push('/login'), 2000);
	}
}
