import { computed } from '@vue/composition-api';

export function useTransform() {
	const toDate = (dateString: string) => computed(() => new Date(dateString));

	return {
		toDate
	};
}
