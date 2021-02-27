<template>
	<v-card class="pa-5">
		<v-form ref="groupForm">
			<v-card-text>
				<v-text-field
					v-model="group.name"
					:rules="[isRequired]"
					class="required"
					label="Název skupiny"
				/>
				<v-select v-model="group.permissions" label="Oprávnění" multiple :items="permissions" />
			</v-card-text>

			<v-card-actions>
				<v-spacer />
				<v-btn color="primary" text @click="createGroup">Uložit</v-btn>
			</v-card-actions>
		</v-form>
	</v-card>
</template>

<script lang="ts">
import { GroupInsertable, User } from '@bokari/api-client';
import { Permission } from '@bokari/entities';
import { defineComponent, reactive, ref } from '@vue/composition-api';
import { asyncComputed, useTitle } from '@vueuse/core';

import { groupsAPIClient, usersAPIClient } from '../http/api';
import { VFormElement } from '../plugins/vuetify';
import { useToastStore } from '../stores/toast.store';
import { useValidation } from '../utils/validations';

export default defineComponent({
	name: 'NewGroup',
	setup() {
		useTitle('Nová skupina');
		const groupForm = ref<VFormElement | null>(null);
		const { showToast } = useToastStore();
		const { isRequired, validate: validateGroupForm } = useValidation(groupForm);

		const permissions = Object.values(Permission);
		const group = reactive<GroupInsertable>({
			name: '',
			permissions: [],
			users: []
		});

		const createGroup = async () => {
			if (!validateGroupForm()) {
				return;
			}

			try {
				await groupsAPIClient.createGroup(group);
				showToast({
					message: `Skupina ${group.name} byla úspěšně vytvořena`,
					type: 'success'
				});
			} catch {
				showToast({
					message:
						'Skupinu se nepodařilo vytvořit. Zkontrolujte například, že již neexistuje skupina se stejným názvem.',
					type: 'error'
				});
			}
		};

		return {
			isRequired,
			permissions,
			group,
			groupForm,
			createGroup
		};
	}
});
</script>

<style scoped></style>
