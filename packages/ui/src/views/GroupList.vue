<template>
	<v-card>
		<v-card-actions v-if="hasPermission(Permission.USERS_WRITE)">
			<v-spacer />
			<v-btn text color="primary" to="/new-group">Vytvořit novou skupinu</v-btn>
			<v-spacer />
		</v-card-actions>

		<v-card-text>
			<v-data-table :loading="loading" :items="groups" :headers="headers">
				<template v-slot:item.users="{ item }">
					<span>{{ item.users.map(u => u.person.name).join(', ') }}</span>
				</template>
				<template v-slot:item.permissions="{ item }">
					<span>{{ item.permissions.join(', ') }}</span>
				</template>
				<template v-slot:item.actions="{ item }">
					<v-btn icon :to="{ name: 'Group', params: { groupId: item.id } }">
						<v-icon>mdi-eye</v-icon>
					</v-btn>
					<v-btn
						v-if="hasPermission(Permission.GROUPS_WRITE)"
						icon
						@click="deleteGroup(item)"
					>
						<v-icon>mdi-delete</v-icon>
					</v-btn>
				</template>
			</v-data-table>
		</v-card-text>
	</v-card>
</template>

<script lang="ts">
import { Group } from '@bokari/api-client';
import { Permission } from '@bokari/entities';
import { defineComponent, ref } from '@vue/composition-api';
import { asyncComputed, useTitle } from '@vueuse/core';

import { groupsAPIClient, usersAPIClient } from '../http/api';
import { VDataTableHeader } from '../plugins/vuetify';
import { useCurrentUserStore } from '../stores/current-user.store';
import { useToastStore } from '../stores/toast.store';

export default defineComponent({
	name: 'GroupList',
	setup() {
		useTitle('Skupiny');

		const { showToast } = useToastStore();
		const { hasPermission } = useCurrentUserStore();

		const loading = ref(true);
		const groups = asyncComputed(
			async () => {
				try {
					return await groupsAPIClient.getAllGroups().then(res => res.data);
				} catch {
					showToast({ message: 'Nepodařilo se načíst seznam skupin', type: 'error' });
				}
			},
			[],
			loading
		);

		const headers: VDataTableHeader[] = [
			{
				text: 'Název skupiny',
				value: 'name'
			},
			{
				text: 'Uživatelé',
				value: 'users'
			},
			{
				text: 'Oprávnění',
				value: 'permissions'
			},
			{
				text: 'Možnosti',
				value: 'actions'
			}
		];

		const deleteGroup = async (group: Group) => {
			try {
				await groupsAPIClient.deleteGroupById(group.id);
				groups.value = groups.value?.filter(g => g.id !== group.id) || [];
				showToast({
					message: `Skupina ${group.name} byla úspěšna smazána`,
					type: 'success'
				});
			} catch {
				showToast({ message: `Skupinu ${group.name} se nepodařilo smazat`, type: 'error' });
			}
		};

		return {
			loading,
			groups,
			headers,
			deleteGroup,
			hasPermission,
			Permission
		};
	}
});
</script>

<style scoped></style>
