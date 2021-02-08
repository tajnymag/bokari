import { createExpressServer, getMetadataArgsStorage } from 'routing-controllers';
import { ErrorHandler } from './middlewares/error-handler';
import { ContractsController } from './controllers/contracts.controller';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { defaultMetadataStorage } from 'class-transformer/cjs/storage';
import { authorizationChecker } from './middlewares/authorization';
import { currentUserChecker } from './middlewares/current-user';
import { UsersController } from './controllers/users.controller';
import { AuthController } from './controllers/auth.controller';
import { FilesController } from './controllers/files.controller';
import { WorkLogsController } from './controllers/worklogs.controller';
import { CustomersController } from './controllers/customers.controller';

const app = createExpressServer({
	cors: true,
	controllers: [
		AuthController,
		UsersController,
		ContractsController,
		FilesController,
		WorkLogsController,
		CustomersController
	],
	middlewares: [ErrorHandler],
	defaultErrorHandler: false,
	validation: {
		stopAtFirstError: true,
		validationError: {
			target: false
		}
	},
	authorizationChecker,
	currentUserChecker
});

if (process.env.BUILD_SCHEMA) {
	const storage = getMetadataArgsStorage();
	const schemas = validationMetadatasToSchemas({
		classTransformerMetadataStorage: defaultMetadataStorage
	});
	const spec = routingControllersToSpec(
		storage,
		{},
		{
			components: { schemas }
		}
	);

	console.debug(JSON.stringify(spec));
}

export { app };
