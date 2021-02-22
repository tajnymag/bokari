<template>
	<v-card>
		<v-card-text>
			<p>
				Tato aplikace vznikla jako bakalářský projekt na fakultě Provozně ekonomické České
				zemědělské univerzity v Praze studentem Markem Lukášem.
			</p>

			<p>Je napsána za použití frameworků Vue/Vuetify + Express/routing-controllers</p>
		</v-card-text>
	</v-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { useTitle } from '@vueuse/core';

export default defineComponent({
	name: 'AboutView',
	setup() {
		useTitle('O aplikaci');
	}
});
</script>
