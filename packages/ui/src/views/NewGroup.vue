<template>
	<v-card></v-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { useTitle } from '@vueuse/core';

export default defineComponent({
	name: 'NewGroup',
	setup() {
		useTitle('Nová skupina');
	}
});
</script>

<style scoped></style>
