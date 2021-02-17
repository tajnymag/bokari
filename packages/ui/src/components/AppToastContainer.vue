<template>
	<div>
		<v-snackbar v-for="toast of toasts" v-model="toast.visible" :key="toast.id">
			{{ toast.message }}
			<template v-slot:action="{ attrs }">
				<v-btn :color="toast.type" text v-bind="attrs" @click="dismissToast(toast.id)">
					Schovat
				</v-btn>
			</template>
		</v-snackbar>
	</div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from '@vue/composition-api';
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
