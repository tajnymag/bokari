import { Exclude, Expose, Type } from "class-transformer";
import { IsOptional, IsString, ValidateNested } from 'class-validator';

import { FileJoinable } from '../../files';

@Exclude()
export class ContractAttachmentInsertable {
  @Expose()
	@Type(() => FileJoinable)
	@ValidateNested()
	file?: FileJoinable;

  @Expose()
	@IsOptional()
	@IsString()
	note?: string;
}
