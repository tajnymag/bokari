import { Authorized, Get, JsonController, QueryParams } from 'routing-controllers';
import { getRepository, Permission, WorkLog, MoreThanOrEqual, LessThanOrEqual } from '@bokari/database';
import { IsDate, IsInt, IsOptional, IsString } from 'class-validator';

class WorkLogsQueryParams implements Partial<WorkLog> {
	@IsOptional()
	@IsString()
	'contract.code'?: string;

	@IsOptional()
	@IsInt()
	'contract.id'?: number;

	@IsOptional()
	@IsString()
	'user.username'?: string;

	@IsOptional()
	@IsInt()
	'user.id'?: number;

	@IsOptional()
	@IsDate()
	from?: Date;

	@IsOptional()
	@IsDate()
	to?: Date;
}

@JsonController('/worklogs')
export class WorkLogsController {
	@Get()
	@Authorized([Permission.USERS_READ])
	async getAllWorkLogs(@QueryParams() query?: WorkLogsQueryParams) {
		const workLogs = await getRepository(WorkLog).find({
			where: {
				contract: {
					id: query?.['contract.id'],
					code: query?.['contract.code']
				},
				user: {
					id: query?.['user.id'],
					username: query?.['user.username']
				},
				from: MoreThanOrEqual(query?.from),
				to: LessThanOrEqual(query?.to)
			},
			relations: ['user', 'contract']
		});

		return workLogs;
	}
}
