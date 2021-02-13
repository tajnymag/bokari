import { Body, CurrentUser, HttpCode, JsonController, Param, Post } from 'routing-controllers';
import { Contract, ContractAttachment, Metadata, User } from '@bokari/entities';
import { ResponseSchema } from 'routing-controllers-openapi';
import { ContractAttachmentInsertable } from './schemas';
import { getRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { CurrentUserPayload } from '../../../middlewares';

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

		const createdAttachment = await getRepository(ContractAttachment).save(attachmentEntity);

		return createdAttachment;
	}
}
