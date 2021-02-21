<template>
	<v-card></v-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { useTitle } from '@vueuse/core';

export default defineComponent({
	name: 'Group',
	props: {
		groupId: {
			type: Number,
			required: true
		}
	},
	setup() {
		useTitle('Skupina');
	}
});
</script>

<style scoped></style>
