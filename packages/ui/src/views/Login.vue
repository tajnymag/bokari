<template>
	<div>
		<v-form @submit.prevent="login(username, password)">
			<v-row justify="center">
				<v-col cols="12" lg="6" md="8" sm="10">
					<v-card>
						<v-card-title>
							<h2 class="text-center text-h2">Přihlášení</h2>
						</v-card-title>

						<v-card-text>
							<v-text-field
								v-model="username"
								label="Uživatelské jméno"
								outlined
								required
							/>
							<v-text-field
								v-model="password"
								label="Heslo"
								outlined
								required
								type="password"
							/>
						</v-card-text>

						<v-divider />

						<v-card-actions>
							<v-spacer />
							<v-btn :loading="isLoggingIn" color="primary" text type="submit">
								Přihlásit se
							</v-btn>
						</v-card-actions>
					</v-card>
				</v-col>
			</v-row>
		</v-form>
	</div>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { useTitle } from '@vueuse/core';

import { useCurrentUserStore } from '../stores/current-user.store';

export default defineComponent({
	name: 'LoginView',
	setup() {
		useTitle('Přihlášení');
		const username = ref<string>('');
		const password = ref<string>('');

		const { login, isLoggingIn } = useCurrentUserStore();

		return {
			username,
			password,
			login,
			isLoggingIn
		};
	}
});
</script>

<style scoped></style>
