<template>
	<v-skeleton-loader v-if="!group" type="card-heading, table" />
	<v-card v-else>
		<v-card-text>
			<v-row>
				<v-col cols="12" md="6">
					<v-card>
						<v-toolbar>
							<v-card-title>Detaily</v-card-title>
							<v-spacer />
							<v-btn icon @click="toggleDetailsEditable">
								<v-icon>
									{{ detailsEditable ? 'mdi-content-save' : 'mdi-pencil' }}
								</v-icon>
							</v-btn>
						</v-toolbar>
						<v-card-text>
							<v-form ref="detailsForm" :readonly="!detailsEditable">
								<v-text-field
									v-model="group.name"
									:rules="[isRequired]"
									class="required"
									label="Název skupiny"
								/>
								<v-select
									v-model="group.permissions"
									label="Oprávnění"
									multiple
									:items="permissions"
								/>
							</v-form>
						</v-card-text>
					</v-card>
				</v-col>

				<v-col cols="12" md="6">
					<v-card>
						<v-toolbar>
							<v-card-title>Uživatelé</v-card-title>
						</v-toolbar>
						<v-card-text>
							<v-data-iterator :items="group.users" item-key="id" hide-default-footer>
								<template v-slot:default="{ items }">
									<v-row>
										<v-col v-for="user in items" :key="user.id" cols="12" md="6">
											<v-card>
												<v-list-item two-line>
													<v-list-item-content>
														<v-list-item-title>
															{{ user.person.name }}
														</v-list-item-title>
														<v-list-item-subtitle>
															{{ user.username }}
														</v-list-item-subtitle>
													</v-list-item-content>

													<v-list-item-avatar>
														<v-avatar size="50" class="ma-3" tile>
															<v-img v-if="user.avatar" :src="user.avatar.url" />
														</v-avatar>
													</v-list-item-avatar>
												</v-list-item>

												<v-card-actions>
													<v-spacer />
													<v-btn icon @click="removeUser(user)">
														<v-icon>mdi-delete</v-icon>
													</v-btn>
													<v-spacer />
												</v-card-actions>
											</v-card>
										</v-col>
									</v-row>
								</template>
							</v-data-iterator>
						</v-card-text>

						<v-card-actions class="pl-4">
							<v-select
								v-model="potentialNewUser"
								label="Nový uživatel"
								:items="users"
								return-object
								item-text="username"
							/>
							<v-btn icon @click="addUser(potentialNewUser)">
								<v-icon>mdi-plus</v-icon>
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script lang="ts">
import { User } from '@bokari/api-client';
import { Permission } from '@bokari/entities';
import { defineComponent, ref } from '@vue/composition-api';
import { asyncComputed, useTitle } from '@vueuse/core';

import { groupsAPIClient, usersAPIClient } from '../http/api';
import { VFormElement } from '../plugins/vuetify';
import { useRouter } from '../router';
import { useToastStore } from '../stores/toast.store';
import { useValidation } from '../utils/validations';

export default defineComponent({
	name: 'Group',
	props: {
		groupId: {
			type: Number,
			required: true
		}
	},
	setup(props) {
		useTitle('Skupina');

		const detailsForm = ref<VFormElement | null>(null);
		const { isRequired, validate: validateDetailsForm } = useValidation(detailsForm);
		const { showToast } = useToastStore();
		const router = useRouter();

		const loading = ref(true);
		const group = asyncComputed(
			async () => {
				try {
					return groupsAPIClient.getGroupById(props.groupId).then(res => res.data);
				} catch {
					await router.push('/404');
					return null;
				}
			},
			null,
			loading
		);

		const permissions = Object.values(Permission);

		const loadingUsers = ref(true);
		const users = asyncComputed<User[]>(
			async () => {
				try {
					return usersAPIClient.getAllUsers().then(res => res.data);
				} catch {
					showToast({ message: 'Nepodařilo se načíst seznam uživatelů', type: 'error' });
					return [];
				}
			},
			[],
			loadingUsers
		);

		const detailsEditable = ref(false);
		const toggleDetailsEditable = async () => {
			detailsEditable.value = !detailsEditable.value;

			if (!validateDetailsForm() || !group.value || detailsEditable.value) {
				return;
			}

			try {
				await groupsAPIClient.editGroup(props.groupId, group.value);
				showToast({ message: 'Název skupiny byl úspěšně aktualizován', type: 'success' });
			} catch {
				showToast({ message: 'Název skupiny se nepodařilo aktulizovat', type: 'error' });
			}
		};

		const removeUser = async (user: User) => {
			if (!group.value) return;

			try {
				const filteredUsers = group.value.users.filter(u => u.id !== user.id);
				const filteredUsersJoinable = filteredUsers.map(u => ({ id: u.id }));
				await groupsAPIClient.editGroup(props.groupId, {
					users: filteredUsersJoinable
				});

				group.value.users = filteredUsers;

				showToast({
					message: `Uživatel ${user.username} byl odebrán ze skupiny ${group.value.name}`,
					type: 'success'
				});
			} catch {
				showToast({ message: 'Nepodařilo se odebrat uživatele ze skupiny', type: 'error' });
			}
		};

		const potentialNewUser = ref<User | null>(null);
		const addUser = async (user: User) => {
			if (!group.value) return;

			if (group.value.users.findIndex(u => u.id === user.id) >= 0) {
				showToast({ message: 'Daný uživatel již ve skupině je', type: 'warning' });
				return;
			}

			try {
				const extendedUsers = [...group.value.users, user];
				const extendedUsersJoinable = extendedUsers.map(u => ({ id: u.id }));
				await groupsAPIClient.editGroup(props.groupId, {
					users: extendedUsersJoinable
				});

				group.value.users = extendedUsers;

				showToast({
					message: `Uživatel ${user.username} byl přidán do skupiny ${group.value.name}`,
					type: 'success'
				});
			} catch {
				showToast({ message: 'Nepodařilo se přidat uživatele do skupiny', type: 'error' });
			}
		};

		return {
			detailsEditable,
			detailsForm,
			group,
			isRequired,
			loading,
			loadingUsers,
			permissions,
			addUser,
			potentialNewUser,
			removeUser,
			toggleDetailsEditable,
			users
		};
	}
});
</script>

<style scoped></style>
