import { Group, Metadata, Permission } from '@bokari/entities';
import { plainToClass } from 'class-transformer';
import { merge } from 'lodash';
import {
	Authorized,
	Body,
	CurrentUser,
	Delete,
	ForbiddenError,
	Get,
	HttpCode,
	HttpError,
	JsonController,
	OnUndefined,
	Param,
	Patch,
	Post
} from 'routing-controllers';
import { ResponseSchema } from 'routing-controllers-openapi';
import { getRepository } from 'typeorm';

import { CurrentUserPayload } from '../../middlewares';

import { GroupInsertable, GroupUpdatable } from './schemas';

@Authorized()
@JsonController('/groups')
export class GroupsController {
	@Get()
	@Authorized([Permission.GROUPS_READ])
	@ResponseSchema(Group, { isArray: true })
	async getAllGroups(): Promise<Group[]> {
		const groups = await getRepository(Group).find({ relations: ['users'] });

		return groups;
	}

	@Get('/:id')
	@Authorized([Permission.GROUPS_READ])
	@ResponseSchema(Group)
	async getGroupById(@Param('id') id: number): Promise<Group> {
		const group = await getRepository(Group).findOneOrFail(id, { relations: ['users'] });

		return group;
	}

	@Post()
	@Authorized([Permission.GROUPS_WRITE])
	@ResponseSchema(Group, { statusCode: 201 })
	async createGroup(
		@CurrentUser() currentUser: CurrentUserPayload,
		@Body() desiredGroup: GroupInsertable
	): Promise<Group> {
		if ((await getRepository(Group).count({ where: { name: desiredGroup.name } })) > 0) {
			throw new HttpError(409, 'A group with such name already exists!');
		}

		const groupEntity = plainToClass(Group, desiredGroup);
		groupEntity.metadata = new Metadata({ createdBy: currentUser });

		const createdGroup = await getRepository(Group).save(groupEntity);

		return createdGroup;
	}

	@Patch('/:id')
	@Authorized([Permission.GROUPS_WRITE])
	@ResponseSchema(Group)
	async editGroup(@Param('id') id: number, @Body() desiredChanges: GroupUpdatable) {
		const groupEntity = await getRepository(Group).findOneOrFail(id);

		const updatedEntity = merge(groupEntity, desiredChanges);

		return getRepository(Group).save(updatedEntity);
	}

	@Delete('/:id')
	@Authorized([Permission.GROUPS_WRITE])
	@OnUndefined(204)
	async deleteGroupById(@Param('id') id: number) {
		if ((await getRepository(Group).count()) === 1) {
			throw new ForbiddenError();
		}

		await getRepository(Group).softDelete(id);
	}
}
