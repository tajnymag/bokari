<template>
	<v-card></v-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { useTitle } from '@vueuse/core';

export default defineComponent({
	name: 'UserList',
	setup() {
		useTitle('Uživatelé');
	}
});
</script>

<style scoped></style>
