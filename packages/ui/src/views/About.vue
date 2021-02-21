<template>
	<v-card>
		<v-card-text>This is an about page</v-card-text>
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
