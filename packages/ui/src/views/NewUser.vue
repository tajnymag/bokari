<template>
	<v-card>
		<v-card-text>
			<v-form ref="userForm">
				<v-text-field
					v-model="user.person.name"
					:rules="[isRequired]"
					class="required"
					label="Jméno osoby"
				/>
				<v-text-field
					v-model="user.username"
					:rules="[isRequired, isUsername]"
					class="required"
					label="Přihlašovací jméno"
				/>
				<v-text-field
					type="password"
					label="Heslo"
					class="required"
					:rules="[isRequired]"
				/>
				<v-select
					v-model="user.groups"
					label="Skupiny oprávnění"
					multiple
					return-object
					:rules="[isRequired, hasEntries]"
					class="required"
					:items="groups"
					item-text="name"
					:loading="loadingGroups"
				/>
			</v-form>
		</v-card-text>

		<v-card-actions>
			<v-spacer />
			<v-btn color="primary" text @click="handleSaveButton">Uložit</v-btn>
		</v-card-actions>
	</v-card>
</template>

<script lang="ts">
import { Group, UserInsertable } from '@bokari/api-client';
import { defineComponent, reactive, ref } from '@vue/composition-api';
import { asyncComputed, useTitle } from '@vueuse/core';

import { groupsAPIClient, usersAPIClient } from '../http/api';
import { VFormElement } from '../plugins/vuetify';
import { useToastStore } from '../stores/toast.store';
import { useValidation } from '../utils/validations';

export default defineComponent({
	name: 'NewUser',
	setup() {
		useTitle('Nový uživatel');

		const userForm = ref<VFormElement | null>(null);
		const { isRequired, isUsername, hasEntries, validate: validateUserForm } = useValidation(
			userForm
		);
		const { showToast } = useToastStore();

		const user = reactive<UserInsertable>({
			person: {
				name: '',
				contacts: []
			},
			username: '',
			password: '',
			groups: []
		});

		const loadingGroups = ref(true);
		const groups = asyncComputed<Group[]>(
			async () => {
				try {
					return groupsAPIClient.getAllGroups().then(res => res.data);
				} catch {
					showToast({
						message: 'Nepodařilo se načíst seznam dostupných skupin oprávnění',
						type: 'error'
					});
					return [];
				}
			},
			[],
			loadingGroups
		);

		const handleSaveButton = async () => {
			if (!validateUserForm()) {
				return;
			}

			try {
				const { data: createdUser } = await usersAPIClient.createUser(user);
				showToast({
					message: `Uživatel ${createdUser.username} byl úspěšně vytvořen`,
					type: 'success'
				});
			} catch {
				showToast({
					message:
						'Uživatele se nepodařilo vytvořit. Zkontrolujte unikátnost přihlašovacího jména a validitu všech ostatních polí.',
					type: 'error'
				});
			}
		};

		return {
			user,
			userForm,
			isRequired,
			isUsername,
			hasEntries,
			loadingGroups,
			groups,
			handleSaveButton
		};
	}
});
</script>

<style scoped></style>
