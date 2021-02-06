import { createExpressServer, getMetadataArgsStorage } from "routing-controllers";
import { ErrorHandler } from './middlewares/error-handler';
import { ContractsController } from "./controllers/contracts.controller";
import { routingControllersToSpec } from "routing-controllers-openapi";
import {validationMetadatasToSchemas} from "class-validator-jsonschema";
import { defaultMetadataStorage } from 'class-transformer/cjs/storage';

const app = createExpressServer({
	controllers: [ContractsController],
	middlewares: [ErrorHandler]
})

if (process.env.BUILD_SCHEMA) {
	const storage = getMetadataArgsStorage();
	const schemas = validationMetadatasToSchemas({
		classTransformerMetadataStorage: defaultMetadataStorage
	});
	const spec = routingControllersToSpec(storage, {}, {
		components: { schemas }
	});

	console.debug(JSON.stringify(spec));
}

export { app };
