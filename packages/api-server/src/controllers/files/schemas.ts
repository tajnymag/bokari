import { Expose } from 'class-transformer';
import { IsInt } from 'class-validator';

@Expose()
export class FileJoinable {
	@IsInt()
	id!: number;
}
