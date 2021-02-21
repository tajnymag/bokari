import { Contract, ContractAttachment, Metadata, User } from '@bokari/entities';
import { plainToClass } from 'class-transformer';
import {
	Authorized,
	Body,
	CurrentUser,
	HttpCode,
	JsonController,
	Param,
	Post
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { getRepository } from 'typeorm';

import { CurrentUserPayload } from '../../../middlewares';

import { ContractAttachmentInsertable } from './schemas';

@Authorized()
@JsonController('/contracts/:code/attachments')
export class ContractAttachmentsController {
	@Post()
	@HttpCode(201)
	@ResponseSchema(ContractAttachment, { statusCode: 201 })
	async createContractAttachment(
		@CurrentUser() currentUser: CurrentUserPayload,
		@Param('code') code: string,
		@Body() desiredAttachment: ContractAttachmentInsertable
	): Promise<ContractAttachment> {
		const contractEntity = await getRepository(Contract).findOneOrFail({
			where: { code },
			select: ['id']
		});

		const attachmentEntity = plainToClass(ContractAttachment, desiredAttachment);
		attachmentEntity.metadata = new Metadata({ createdBy: currentUser });
		attachmentEntity.contract = contractEntity;

		const createdAttachment = await getRepository(ContractAttachment).save(
			attachmentEntity,
			{}
		);

		return getRepository(ContractAttachment).findOneOrFail(createdAttachment.id, {
			relations: ['metadata.createdBy']
		});
	}
}
