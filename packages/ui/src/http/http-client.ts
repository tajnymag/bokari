import axios from 'axios';
import createAuthRefreshInterceptor from 'axios-auth-refresh';

import { injectAccessTokenInterceptor, refreshAccessTokenLogic } from './auth';

export const httpClient = axios.create();
export const authHttpClient = axios.create();

httpClient.interceptors.request.use(injectAccessTokenInterceptor);
createAuthRefreshInterceptor(httpClient, refreshAccessTokenLogic);
