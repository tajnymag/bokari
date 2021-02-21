<template>
	<v-row justify="center">
		<v-col>
			<v-card>Omlouváme se, ale hledaná strana nebyla nalezena.</v-card>
		</v-col>
	</v-row>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { useTitle } from '@vueuse/core';

export default defineComponent({
	name: 'NotFoundView',
	setup() {
		useTitle('Stránka nebyla nalezena');
	}
});
</script>

<style scoped></style>
