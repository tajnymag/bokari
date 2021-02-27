import { Exclude, Expose } from 'class-transformer';
import { IsInt } from 'class-validator';

@Exclude()
export class FileJoinable {
	@Expose()
	@IsInt()
	id!: number;
}
