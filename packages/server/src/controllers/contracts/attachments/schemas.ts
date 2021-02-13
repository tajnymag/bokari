import { Expose, Type } from 'class-transformer';
import { IsOptional, IsString, ValidateNested } from 'class-validator';
import { FileJoinable } from '../../files';

@Expose()
export class ContractAttachmentInsertable {
	@Type(() => FileJoinable)
	@ValidateNested()
	file?: FileJoinable;

	@IsOptional()
	@IsString()
	note?: string;
}
