<template>
	<v-row justify="center">
		<v-col>
			<v-card>Omlouváme se, ale hledaná strana nebyla nalezena.</v-card>
		</v-col>
	</v-row>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';

export default defineComponent({
	name: 'NotFoundView'
});
</script>

<style scoped></style>
