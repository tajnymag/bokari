<template>
	<div id="login-view">
		<v-row justify="center">
			<v-col cols="12" sm="10" md="8" lg="6">
				<v-card>
					<v-card-title>
						<h2 class="text-h2 text-center">Přihlášení</h2>
					</v-card-title>

					<v-card-text>
						<v-text-field label="Uživatelské jméno" outlined required />
						<v-text-field label="Heslo" type="password" outlined required />
					</v-card-text>

					<v-divider />

					<v-card-actions>
						<v-spacer />
						<v-btn text color="primary">Přihlásit se</v-btn>
					</v-card-actions>
				</v-card>
			</v-col>
		</v-row>
	</div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
	name: 'Login'
});
</script>

<style scoped></style>
