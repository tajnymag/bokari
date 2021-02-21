import { Dirent } from 'fs';
import { copyFile, link, mkdir, readdir } from 'fs/promises';
import * as os from 'os';
import * as path from 'path';

import { File, Metadata, User } from '@bokari/entities';
import { Express, Request } from 'express';
import hasha from 'hasha';
import {
	Authorized,
	CurrentUser,
	Get,
	HttpCode,
	JsonController,
	Param,
	Post,
	Req,
	UploadedFile,
	UploadOptions
} from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { getRepository } from 'typeorm';

import { BOKARI_UPLOADS_SERVE_PATH, BOKARI_UPLOADS_STORAGE_DIR } from '../../env.config';
import { existsAsync } from '../../helpers/fs';
import { TypeormQuery } from '../../helpers/typing';
import { CurrentUserPayload } from '../../middlewares';

const MULTER_OPTIONS: UploadOptions = {
	options: {
		dest: path.resolve(os.tmpdir(), 'bokari-uploads')
	}
};

@Authorized()
@JsonController('/files')
export class FilesController {
	@Get('/:id')
	@Authorized()
	@ResponseSchema(File)
	async getFileById(@Param('id') id: number, @Req() req: Request): Promise<File> {
		const file = await getRepository(File).findOneOrFail(id, {
			relations: ['metadata.createdBy']
		});

		return file;
	}

	@Post()
	@OpenAPI({
		requestBody: {
			content: {
				'multipart/form-data': {
					schema: {
						type: 'object',
						properties: {
							file: {
								type: 'string',
								format: 'binary'
							}
						}
					}
				}
			}
		}
	})
	@HttpCode(201)
	@ResponseSchema(File, { statusCode: 201 })
	async uploadFile(
		@UploadedFile('file', MULTER_OPTIONS) uploadedFile: Express.Multer.File,
		@CurrentUser() currentUser: CurrentUserPayload
	): Promise<File> {
		const hash = await hasha.fromFile(uploadedFile.path, { algorithm: 'sha256' });

		const normalizedFilename = uploadedFile.originalname
			.replace(/[^a-z0-9.]/gi, '_')
			.toLowerCase();

		const storagePath = path.join(BOKARI_UPLOADS_STORAGE_DIR, hash);
		const toStoreFilePath = path.join(storagePath, normalizedFilename);

		const urlPath = `${BOKARI_UPLOADS_SERVE_PATH}/${hash}/${normalizedFilename}`;

		const hashExists = await existsAsync(storagePath);
		const filenameExists = await existsAsync(storagePath);

		if (!hashExists) {
			await mkdir(storagePath, { recursive: true });
		}

		const existingStoredFiles = await readdir(storagePath, {
			withFileTypes: true
		});

		if (!existingStoredFiles.some(f => f.isFile())) {
			await copyFile(uploadedFile.path, toStoreFilePath);
		} else if (!filenameExists) {
			const randomStoredFile = existingStoredFiles.find(f => f.isFile()) as Dirent;
			const randomStoredFilePath = path.join(storagePath, randomStoredFile.name);

			await link(randomStoredFilePath, toStoreFilePath);
		}

		const existingEntity = await getRepository(File).findOne(
			{ filename: normalizedFilename, hash },
			{ relations: ['metadata.createdBy'] }
		);

		if (existingEntity !== undefined) {
			return existingEntity;
		}

		const fileEntity = new File();
		fileEntity.filename = normalizedFilename;
		fileEntity.mimeType = uploadedFile.mimetype;
		fileEntity.hash = hash;
		fileEntity.url = urlPath;
		fileEntity.metadata = new Metadata({ createdBy: currentUser });

		const createdFile = await getRepository(File).save(fileEntity);

		return createdFile;
	}
}
