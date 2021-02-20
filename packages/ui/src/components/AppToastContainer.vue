<template>
	<div>
		<v-snackbar v-for="toast of toasts" :key="toast.id" v-model="toast.visible">
			{{ toast.message }}
			<template v-slot:action="{ attrs }">
				<v-btn v-bind="attrs" :color="toast.type" text @click="dismissToast(toast.id)">
					Schovat
				</v-btn>
			</template>
		</v-snackbar>
	</div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import { useToastStore } from '@/stores/toast.store';

export default defineComponent({
	name: 'AppToastContainer',
	setup() {
		const toastStore = useToastStore();

		return {
			...toastStore
		};
	}
});
</script>

<style scoped></style>
