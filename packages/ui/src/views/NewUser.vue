<template>
	<v-card></v-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { useTitle } from '@vueuse/core';

export default defineComponent({
	name: 'NewUser',
	setup() {
		useTitle('Nový uživatel');
	}
});
</script>

<style scoped></style>
