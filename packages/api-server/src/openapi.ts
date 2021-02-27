import { defaultMetadataStorage } from 'class-transformer/cjs/storage';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';

import { routingControllersOptions } from './routing-controllers';

export type OpenAPISpecDocumentObject = ReturnType<typeof routingControllersToSpec>;

export async function getBokariOpenAPISpecs(): Promise<OpenAPISpecDocumentObject> {
	const storage = getMetadataArgsStorage();
	const schemas = validationMetadatasToSchemas({
		refPointerPrefix: '#/components/schemas/',
		classTransformerMetadataStorage: defaultMetadataStorage
	});

	const spec = routingControllersToSpec(storage, routingControllersOptions, {
		components: { schemas },
		info: {
			title: 'Bokari REST API',
			version: process.env.npm_package_version ?? '0.0.0'
		},
		servers: [
			{ url: 'http://localhost:3000', description: 'Local dev server' },
			{ url: 'https://bokari.t4t.cz', description: 'T4T production instance' }
		]
	});

	/** Temporarily remove controller name from operation ids until codegen implements a better way **/
	for (const apiPath in spec.paths) {
		if (!Object.prototype.hasOwnProperty.call(spec.paths, apiPath)) {
			continue;
		}

		for (const method in spec.paths[apiPath]) {
			if (!Object.prototype.hasOwnProperty.call(spec.paths[apiPath], method)) {
				continue;
			}

			const handlerInfo = spec.paths[apiPath][method];
			handlerInfo.operationId = handlerInfo.operationId.replace(/^\w+Controller\./, '');
		}
	}

	return spec;
}
