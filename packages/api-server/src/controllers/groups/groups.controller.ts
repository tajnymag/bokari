import { Group, Permission } from '@bokari/entities';
import { plainToClass } from 'class-transformer';
import {
  Authorized,
  Body, Delete,
  Get,
  HttpCode,
  HttpError,
  JsonController, OnUndefined,
  Param,
  Post
} from "routing-controllers";
import { ResponseSchema } from 'routing-controllers-openapi';
import { getRepository } from 'typeorm';

import { GroupInsertable } from './schemas';

@Authorized()
@JsonController('/groups')
export class GroupsController {
	@Get()
	@Authorized([Permission.USERS_READ])
	@ResponseSchema(Group, { isArray: true })
	async getAllGroups(): Promise<Group[]> {
		const groups = await getRepository(Group).find({ relations: ['users'] });

		return groups;
	}

	@Get('/:id')
	@Authorized([Permission.USERS_READ])
	@ResponseSchema(Group)
	async getGroupById(@Param('id') id: number): Promise<Group> {
		const group = await getRepository(Group).findOneOrFail(id, { relations: ['users'] });

		return group;
	}

	@Post()
	@Authorized([Permission.USERS_WRITE])
	@ResponseSchema(Group, { statusCode: 201 })
	async createGroup(@Body() desiredGroup: GroupInsertable): Promise<Group> {
		if ((await getRepository(Group).count({ where: { name: desiredGroup.name } })) > 0) {
			throw new HttpError(409, 'A group with such name already exists!');
		}

		const groupEntity = plainToClass(Group, desiredGroup);

		const createdGroup = await getRepository(Group).save(groupEntity);

		return createdGroup;
	}

	@Delete('/:id')
  @Authorized([Permission.USERS_WRITE])
  @OnUndefined(204)
  async deleteGroupById(@Param('id') id: number) {
	  await getRepository(Group).softDelete(id);
  }
}
