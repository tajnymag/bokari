<template>
	<v-card>
		<v-card-text></v-card-text>
	</v-card>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { useTitle } from '@vueuse/core';

export default defineComponent({
	name: 'HomeView',
	setup() {
		useTitle('Bokari');
	}
});
</script>
