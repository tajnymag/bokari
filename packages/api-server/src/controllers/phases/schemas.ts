import { Phase } from '@bokari/entities';
import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsString } from 'class-validator';

@Exclude()
export class PhaseInsertable extends Phase {
	@Expose()
	@IsString()
	name!: string;
}

@Exclude()
export class PhaseJoinable extends Phase {
	@Expose()
	@IsInt()
	id!: number;
}
