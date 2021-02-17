<template>
	<div id="login-view">
		<v-form v-on:submit.prevent="login(username, password)">
			<v-row justify="center">
				<v-col cols="12" sm="10" md="8" lg="6">
					<v-card>
						<v-card-title>
							<h2 class="text-h2 text-center">Přihlášení</h2>
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
								type="password"
								outlined
								required
							/>
						</v-card-text>

						<v-divider />

						<v-card-actions>
							<v-spacer />
							<v-btn type="submit" text color="primary" :loading="isLoggingIn">
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
import { useCurrentUserStore } from '@/stores/current-user.store';

export default defineComponent({
	name: 'Login',
	setup() {
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
