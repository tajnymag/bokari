import { computed, reactive, readonly, ref } from '@vue/composition-api';

export interface ToastOptions {
	message: string;
	type: 'success' | 'error' | 'warning';
	outlined?: boolean;
	timeout?: number;
}

export interface StoredToast extends ToastOptions {
	id: number;
	visible: boolean;
}

export interface ToastStoreState {
	toasts: StoredToast[];
	idCounter: number;
}

let state: ToastStoreState;

export function useToastStore() {
	if (!state) {
		state = reactive<ToastStoreState>({
			toasts: [],
			idCounter: 0
		});
	}

	const showToast = (options: ToastOptions) => {
		const id = ++state.idCounter;
		const message = options.message;
		const type = options.type;
		const outlined = options.outlined ?? false;
		const timeout = options.timeout ?? 2000;
		const visible = true;

		state.toasts.push({ id, message, type, outlined, timeout, visible });
	};

	const dismissToast = (id: number) => {
		const foundToast = state.toasts.find((toast) => toast.id === id);

		if (!foundToast) {
			return;
		}

		foundToast.visible = false;
	};

	return {
		toasts: readonly(state.toasts),
		showToast,
		dismissToast
	};
}
