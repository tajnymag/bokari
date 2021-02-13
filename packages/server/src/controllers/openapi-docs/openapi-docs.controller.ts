import { ContentType, Controller, Get, getMetadataArgsStorage } from 'routing-controllers';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { defaultMetadataStorage } from 'class-transformer/cjs/storage';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { html } from 'common-tags';

@Controller('/openapi-docs')
export class OpenAPIDocsController {
	private cachedSpec?: ReturnType<typeof routingControllersToSpec>;

	@Get('/openapi3.json')
	@ContentType('application/json')
	serveSpec(): ReturnType<typeof routingControllersToSpec> {
		if (!this.cachedSpec) {
			const storage = getMetadataArgsStorage();
			const schemas = validationMetadatasToSchemas({
				refPointerPrefix: '#/components/schemas/',
				classTransformerMetadataStorage: defaultMetadataStorage
			});
			this.cachedSpec = routingControllersToSpec(
				storage,
				{},
				{
					components: { schemas }
				}
			);
		}

		return this.cachedSpec;
	}

	@Get()
	@ContentType('text/html')
	serveDocs(): string {
		return html`
			<!DOCTYPE html>
			<html>
				<head>
					<title>ReDoc</title>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					<link
						href="https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700"
						rel="stylesheet"
					/>

					<style>
						body {
							margin: 0;
							padding: 0;
						}
					</style>
				</head>
				<body>
					<redoc spec-url="/openapi-docs/openapi3.json"></redoc>
					<script src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"></script>
				</body>
			</html>
		`;
	}
}
