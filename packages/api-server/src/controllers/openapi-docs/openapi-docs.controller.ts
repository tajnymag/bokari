import { ContentType, Controller, Get, getMetadataArgsStorage } from 'routing-controllers';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { defaultMetadataStorage } from 'class-transformer/cjs/storage';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import { html } from 'common-tags';
import { writeFile } from 'fs/promises';
import { getOpenAPI3SpecPath } from '@bokari/api-specs';
import { getBokariOpenAPISpecs, OpenAPISpecDocumentObject } from '../../openapi';

@Controller('/openapi-docs')
export class OpenAPIDocsController {
	private cachedSpec?: OpenAPISpecDocumentObject;

	@Get('/openapi3.json')
	@ContentType('application/json')
	async serveSpec(): Promise<OpenAPISpecDocumentObject | undefined> {
		if (!this.cachedSpec) {
			this.cachedSpec = await getBokariOpenAPISpecs();

			await writeFile(getOpenAPI3SpecPath(), JSON.stringify(this.cachedSpec), {
				encoding: 'utf-8'
			});
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
					<redoc spec-url="./openapi-docs/openapi3.json"></redoc>
					<script src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"></script>
				</body>
			</html>
		`;
	}
}
