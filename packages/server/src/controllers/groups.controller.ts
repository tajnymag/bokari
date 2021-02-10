import { Authorized, Body, Get, HttpError, JsonController, Param, Post } from 'routing-controllers';
import { getRepository, Group, Permission } from '@bokari/database';

@Authorized()
@JsonController('/groups')
export class GroupsController {
	@Get()
	@Authorized([Permission.USERS_READ])
	async getAllGroups(): Promise<Group[]> {
		const groups = await getRepository(Group).find();

		return groups;
	}

	@Get('/:id')
	@Authorized([Permission.USERS_READ])
	async getGroupById(@Param('id') id: number): Promise<Group> {
		const group = await getRepository(Group).findOneOrFail(id);

		return group;
	}

	@Post()
	@Authorized([Permission.USERS_WRITE])
	async createGroup(@Body() desiredGroup: Group) {
		if ((await getRepository(Group).count({ where: { name: desiredGroup.name } })) > 0) {
			throw new HttpError(409, 'A group with such name already exists!');
		}

		const groupEntity = new Group();
		groupEntity.name = desiredGroup.name;
		groupEntity.permissions = desiredGroup.permissions;
		groupEntity.users = desiredGroup.users;

		const createdGroup = await getRepository(Group).save(groupEntity);

		return createdGroup;
	}
}
