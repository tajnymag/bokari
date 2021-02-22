<template>
	<v-card>
		<v-card-actions v-if="hasPermission(Permission.USERS_WRITE)">
			<v-spacer />
			<v-btn text color="primary" to="/new-user">Vytvořit nového uživatele</v-btn>
			<v-spacer />
		</v-card-actions>

		<v-card-text>
			<v-data-table :loading="loading" :items="users" :headers="headers">
				<template v-slot:item.groups="{ item }">
					<span>{{ item.groups.map(g => g.name).join(', ') }}</span>
				</template>
				<template v-slot:item.actions="{ item }">
					<v-btn icon :to="{ name: 'User', params: { username: item.username } }">
						<v-icon>mdi-eye</v-icon>
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
	name: 'UserList',
	setup() {
		useTitle('Uživatelé');

		const { showToast } = useToastStore();
		const { hasPermission } = useCurrentUserStore();

		const loading = ref(true);
		const users = asyncComputed(
			async () => {
				try {
					return await usersAPIClient.getAllUsers().then(res => res.data);
				} catch {
					showToast({ message: 'Nepodařilo se načíst seznam uživatelů', type: 'error' });
				}
			},
			[],
			loading
		);

		const headers: VDataTableHeader[] = [
			{
				text: 'Přihlašovací jméno',
				value: 'username'
			},
			{
				text: 'Jméno',
				value: 'person.name'
			},
			{
				text: 'Skupiny',
				value: 'groups'
			},
			{
				text: 'Možnosti',
				value: 'actions'
			}
		];

		return {
			loading,
			users,
			headers,
			hasPermission,
			Permission
		};
	}
});
</script>

<style scoped></style>
