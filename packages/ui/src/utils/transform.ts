import { computed } from '@vue/composition-api';

export function useFormatter() {
	const toDate = (dateString: string) => computed(() => new Date(dateString));

	return {
		toDate
	};
}
