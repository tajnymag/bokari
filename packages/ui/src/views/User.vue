<template>
	<v-skeleton-loader v-if="!user" type="card-heading, table" />
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
									v-model="user.person.name"
									:rules="[isRequired]"
									label="Jméno"
								/>
								<v-text-field
									v-if="detailsEditable"
									v-model="user.password"
									type="password"
									label="Heslo"
								/>
								<v-text-field
									v-else
									value="password"
									type="password"
									label="Heslo"
								/>
								<v-select
									v-model="user.groups"
									multiple
									:rules="[isRequired, hasEntries]"
									:items="groups"
									:loading="loadingGroups"
									item-text="name"
									return-object
								></v-select>
							</v-form>
						</v-card-text>
					</v-card>
				</v-col>

				<v-col cols="12" md="6">
					<contact-list-card v-model="user.person.contacts" :person-id="user.person.id" />
				</v-col>

				<v-col cols="12" md="6">
					<v-card>
						<v-toolbar>
							<v-card-title>Avatar</v-card-title>
						</v-toolbar>

						<div class="d-flex flex-no-wrap justify-space-between">
							<v-card-text>
								<v-form ref="avatarForm">
									<v-file-input
										v-model="avatar"
										label="Nový avatar"
										accept="image/*"
										:rules="[isImage, hasSizeMax(1000000)]"
									/>
									<v-btn
										text
										color="primary"
										class="ml-4"
										@click="handleUploadAvatarButton"
									>
										Nahrát
									</v-btn>
								</v-form>
							</v-card-text>
							<v-avatar size="125" class="ma-3" tile>
								<v-img v-if="user.avatar" :src="user.avatar.url" />
							</v-avatar>
						</div>
					</v-card>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script lang="ts">
import { Group, User } from '@bokari/api-client';
import { defineComponent, ref, watchEffect } from '@vue/composition-api';
import { asyncComputed, useTitle } from '@vueuse/core';

import ContactListCard from '../components/ContactListCard.vue';
import { filesAPIClient, groupsAPIClient, usersAPIClient } from '../http/api';
import { VFormElement } from '../plugins/vuetify';
import { useRouter } from '../router';
import { useToastStore } from '../stores/toast.store';
import { useValidation } from '../utils/validations';

export default defineComponent({
	name: 'User',
	components: {
		ContactListCard
	},
	props: {
		username: {
			type: String,
			required: true
		}
	},
	setup(props) {
		const title = useTitle('Uživatel');

		const detailsForm = ref<VFormElement | null>(null);
		const avatarForm = ref<VFormElement | null>(null);
		const avatar = ref<File | null>(null);

		const { showToast } = useToastStore();
		const router = useRouter();
		const { isRequired, isUsername, hasEntries, validate: validateDetailsForm } = useValidation(
			detailsForm
		);
		const { isImage, hasSizeMax, validate: validateAvatarForm } = useValidation(avatarForm);

		const loading = ref(true);
		const user = asyncComputed<User | null>(
			async () => {
				try {
					return usersAPIClient.getUserByUsername(props.username).then(res => res.data);
				} catch {
					await router.push('/404');
					return null;
				}
			},
			null,
			loading
		);

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

		const detailsEditable = ref(false);
		const toggleDetailsEditable = async () => {
			detailsEditable.value = !detailsEditable.value;

			if (!validateDetailsForm()) return;

			if (!detailsEditable.value && user.value) {
				try {
					await usersAPIClient.editUser(user.value.username, user.value);
					showToast({
						message: 'Údaje uživatele byly úspěšně aktualizovány.',
						type: 'success'
					});
				} catch {
					showToast({
						message: 'Nepodařilo se aktualizovat údaje uživatele.',
						type: 'error'
					});
				}
			}
		};

		const handleUploadAvatarButton = async () => {
			if (!validateAvatarForm()) return;

			try {
				const { data: uploadedFile } = await filesAPIClient.uploadFile(avatar.value);
				const { data: updatedUser } = await usersAPIClient.editUser(props.username, {
					avatar: { id: uploadedFile.id }
				});

				if (user.value) {
					user.value.avatar = uploadedFile;
				}

				showToast({ message: 'Avatar byl úspěšně aktualizován', type: 'success' });
			} catch {
				showToast({
					message: 'Nepodařilo se aktualizovat avatar uživatele',
					type: 'error'
				});
			}
		};

		watchEffect(() => {
			if (user.value?.person) {
				title.value = user.value.person.name;
			}
		});

		return {
			user,
			avatar,
			avatarForm,
			detailsForm,
			detailsEditable,
			loading,
			isRequired,
			isUsername,
			isImage,
			hasSizeMax,
			hasEntries,
			loadingGroups,
			groups,
			handleUploadAvatarButton,
			toggleDetailsEditable
		};
	}
});
</script>

<style scoped></style>
