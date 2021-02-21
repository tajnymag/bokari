import {
	AuthApi,
	ContractAttachmentsApi,
	ContractPhasesApi,
	ContractsApi,
	CustomersApi,
	FilesApi,
	GroupsApi,
	PeopleApi,
	PhasesApi,
	UsersApi,
	WorkLogsApi
} from '@bokari/api-client';
import { AxiosInstance } from 'axios';

import { authHttpClient, httpClient } from './http-client';

const authAPIClientConfig: [undefined, undefined, AxiosInstance] = [
	undefined,
	undefined,
	authHttpClient
];

const commonAPIClientConfig: [undefined, undefined, AxiosInstance] = [
	undefined,
	undefined,
	httpClient
];

export const authAPIClient = new AuthApi(...authAPIClientConfig);
export const contractsAPIClient = new ContractsApi(...commonAPIClientConfig);
export const contractPhasesAPIClient = new ContractPhasesApi(...commonAPIClientConfig);
export const contractAttachmentsAPIClient = new ContractAttachmentsApi(...commonAPIClientConfig);
export const customersAPIClient = new CustomersApi(...commonAPIClientConfig);
export const filesAPIClient = new FilesApi(...commonAPIClientConfig);
export const groupsAPIClient = new GroupsApi(...commonAPIClientConfig);
export const peopleAPIClient = new PeopleApi(...commonAPIClientConfig);
export const phaseAPIClient = new PhasesApi(...commonAPIClientConfig);
export const usersAPIClient = new UsersApi(...commonAPIClientConfig);
export const workLogsAPIClient = new WorkLogsApi(...commonAPIClientConfig);
