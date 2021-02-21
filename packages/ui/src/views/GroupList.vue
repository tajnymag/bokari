<template>
	<v-card></v-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { useTitle } from '@vueuse/core';

export default defineComponent({
	name: 'GroupList',
	setup() {
		useTitle('Skupiny');
	}
});
</script>

<style scoped></style>
