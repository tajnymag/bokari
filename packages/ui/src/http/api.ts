import { AxiosInstance } from 'axios';
import { authHttpClient, httpClient } from '@/http/http-client';
import {
	AuthApi,
	ContractsApi,
	CustomersApi,
	FilesApi,
	GroupsApi,
	PeopleApi,
	PhasesApi,
	UsersApi,
	WorkLogsApi
} from '@bokari/api-client';

const commonAPIClientConfig: [undefined, undefined, AxiosInstance] = [
	undefined,
	undefined,
	httpClient
];

export const authAPIClient = new AuthApi(undefined, undefined, authHttpClient);
export const contractsAPIClient = new ContractsApi(...commonAPIClientConfig);
export const customersAPIClient = new CustomersApi(...commonAPIClientConfig);
export const filesAPIClient = new FilesApi(...commonAPIClientConfig);
export const groupsAPIClient = new GroupsApi(...commonAPIClientConfig);
export const peopleAPIClient = new PeopleApi(...commonAPIClientConfig);
export const phaseAPIClient = new PhasesApi(...commonAPIClientConfig);
export const usersAPIClient = new UsersApi(...commonAPIClientConfig);
export const workLogsAPIClient = new WorkLogsApi(...commonAPIClientConfig);
