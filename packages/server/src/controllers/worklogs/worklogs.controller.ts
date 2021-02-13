import {
	Authorized,
	Body,
	CurrentUser,
	Get,
	HttpCode,
	JsonController,
	Post,
	QueryParams
} from 'routing-controllers';
import { Metadata, Permission, User, WorkLog } from '@bokari/entities';
import { getRepository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { WorkLogInsertable, WorkLogsQueryParams } from './schemas';
import { ResponseSchema } from 'routing-controllers-openapi';
import { plainToClass } from 'class-transformer';
import { CurrentUserPayload } from '../../middlewares';

@Authorized()
@JsonController('/worklogs')
export class WorkLogsController {
	@Get()
	@Authorized([Permission.USERS_READ])
	@ResponseSchema(WorkLog, { isArray: true })
	async getAllWorkLogs(@QueryParams() query?: WorkLogsQueryParams): Promise<WorkLog[]> {
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

	@Post()
	@HttpCode(201)
	@ResponseSchema(WorkLogInsertable)
	async createWorkLog(
		@CurrentUser() currentUser: CurrentUserPayload,
		@Body() desiredWorkLog: WorkLogInsertable
	): Promise<WorkLog> {
		const workLogEntity = plainToClass(WorkLog, desiredWorkLog);
		workLogEntity.metadata = new Metadata({ createdBy: currentUser });
		workLogEntity.user = await getRepository(User).findOneOrFail(desiredWorkLog.user);

		const createdWorkLog = await getRepository(WorkLog).save(workLogEntity);

		return createdWorkLog;
	}
}
