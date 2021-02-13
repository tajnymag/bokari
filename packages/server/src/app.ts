import { createExpressServer } from 'routing-controllers';

import {
	AuthController,
	ContractAttachmentsController,
	ContractPhasesController,
	ContractsController,
	CustomersController,
	FilesController,
	GroupsController,
	OpenAPIDocsController,
	PhasesController,
	UsersController,
	WorkLogsController
} from './controllers';

import { authorizationChecker, currentUserChecker, ErrorHandler } from './middlewares';
import { PeopleController } from './controllers/people';

const app = createExpressServer({
	cors: true,
	controllers: [
		AuthController,
		ContractsController,
		ContractAttachmentsController,
		ContractPhasesController,
		CustomersController,
		FilesController,
		GroupsController,
		OpenAPIDocsController,
		PhasesController,
		PeopleController,
		UsersController,
		WorkLogsController
	],
	middlewares: [ErrorHandler],
	defaultErrorHandler: false,
	classTransformer: true,
	validation: {
		whitelist: true,
		forbidUnknownValues: true,
		forbidNonWhitelisted: true,
		skipMissingProperties: true,
		validationError: {
			target: false
		}
	},
	authorizationChecker,
	currentUserChecker
});

export { app };
