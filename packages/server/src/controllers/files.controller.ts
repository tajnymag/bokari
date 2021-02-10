import {
	Authorized,
	CurrentUser,
	Get,
	JsonController,
	Param,
	Post,
	Req,
	UploadedFile,
	UploadOptions
} from 'routing-controllers';
import { Request, Express } from 'express';
import hasha from 'hasha';
import * as path from 'path';

import { File, getRepository, Metadata, User } from '@bokari/database';
import * as os from 'os';
import * as fs from 'fs-extra';

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
	async getFileById(@Param('id') id: number, @Req() req: Request): Promise<File> {
		const file = await getRepository(File).findOneOrFail(id);

		return file;
	}

	@Post()
	async uploadFile(
		@UploadedFile('file', MULTER_OPTIONS) uploadedFile: Express.Multer.File,
		@CurrentUser() currentUser: User
	): Promise<File> {
		const hash = await hasha.fromFile(uploadedFile.path, { algorithm: 'sha256' });

		const normalizedFilename = uploadedFile.originalname
			.replace(/[^a-z0-9.]/gi, '_')
			.toLowerCase();

		const storagePath = path.resolve(
			process.env.BOKARI_UPLOADS_DIR ?? __dirname,
			hash,
			normalizedFilename
		);

		const urlPath = `/static/uploads/${hash}/${normalizedFilename}`;

		if (!(await fs.pathExists(storagePath))) {
			await fs.copy(uploadedFile.path, storagePath);
		}

		const fileEntity = new File();
		fileEntity.filename = uploadedFile.originalname;
		fileEntity.mimeType = uploadedFile.mimetype;
		fileEntity.hash = hash;
		fileEntity.url = urlPath;
		fileEntity.metadata = new Metadata({ createdBy: currentUser });

		const createdFile = await getRepository(File).save(fileEntity);

		return createdFile;
	}
}
