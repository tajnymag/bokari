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

import { BOKARI_API_URL } from '../env.config';

import { authHttpClient, httpClient } from './http-client';

const authAPIClientConfig: [undefined, string, AxiosInstance] = [
	undefined,
	BOKARI_API_URL,
	authHttpClient
];

const commonAPIClientConfig: [undefined, string, AxiosInstance] = [
	undefined,
	BOKARI_API_URL,
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
