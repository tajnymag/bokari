import { Body, CurrentUser, JsonController, Param, Post } from 'routing-controllers';
import { Contract, ContractAttachment, getRepository, Metadata, User } from '@bokari/database';

@JsonController('/contracts/:code/attachments')
export class ContractAttachmentsController {
	@Post()
	async createContractAttachment(
		@CurrentUser() currentUser: User,
		@Param('code') code: string,
		@Body() desiredAttachment: ContractAttachment
	): Promise<ContractAttachment> {
		const contractEntity = await getRepository(Contract).findOneOrFail({
			where: { code },
			select: ['id']
		});

		const attachmentEntity = new ContractAttachment();
		attachmentEntity.metadata = new Metadata({ createdBy: currentUser });
		attachmentEntity.contract = contractEntity;
		attachmentEntity.file = desiredAttachment.file;
		attachmentEntity.note = desiredAttachment.note;

		const createdAttachment = await getRepository(ContractAttachment).save(attachmentEntity);

		return createdAttachment;
	}
}
