<template>
	<v-card></v-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { useTitle } from '@vueuse/core';

export default defineComponent({
	name: 'User',
	props: {
		username: {
			type: String,
			required: true
		}
	},
	setup() {
		useTitle('Uživatel');
	}
});
</script>

<style scoped></style>
