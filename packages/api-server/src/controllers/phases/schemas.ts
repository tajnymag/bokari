import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

@Exclude()
export class PhaseInsertable {
	@Expose()
	@IsString()
	name!: string;
}

@Exclude()
export class PhaseJoinable {
	@Expose()
	@IsInt()
	id!: number;
}
