import { User } from '@bokari/api-client';
import { computed, reactive, ref, toRef } from '@vue/composition-api';
import { Permission } from '@bokari/entities';
import { resetTokens, saveAccessToken, saveRefreshToken } from '@/http/auth';
import { useToastStore } from '@/stores/toast.store';
import { authAPIClient, usersAPIClient } from '@/http/api';
import { useRouter } from '@/router';
import { useLocalStorage } from '@vueuse/core';

export interface UserStoreState {
	user: User | null;
}

let state: UserStoreState;

export function useCurrentUserStore() {
	if (!state) {
		state = reactive({
			user: null
		});
	}

	const toastStore = useToastStore();
	const router = useRouter();
	const storedUsername = useLocalStorage<string | null>('username', null);

	const isLoggingIn = ref<boolean>(false);
	const isLoggedIn = computed<boolean>(() => !!state.user);
	const isCurrentUserLoaded = computed(() => !!state.user?.person);
	const permissions = computed<Permission[]>(() => {
		const foundPermissions: Permission[] = [];

		if (!state.user) {
			return [];
		}

		for (const group of state.user.groups) {
			for (const permission of group.permissions) {
				if (!foundPermissions.includes(permission)) {
					foundPermissions.push(permission);
				}
			}
		}

		return foundPermissions;
	});

	const hasPermission = (permission: Permission): boolean =>
		permissions.value.includes(permission);

	const reloadProfile = async () => {
		if (!state.user?.username && !storedUsername.value) {
			toastStore.showToast({ message: 'Přihlašte se, prosím.', type: 'warning' });
			await router.push('/login');
			return;
		}

		if (!storedUsername.value) {
			toastStore.showToast({
				message: 'Nebylo zadáno validní uživatelské jméno!',
				type: 'error'
			});
			return;
		}

		const { data: user } = await usersAPIClient.getUserByUsername(storedUsername.value);

		state.user = user;
	};

	const login = async (username: string, password: string) => {
		resetTokens();
		try {
			isLoggingIn.value = true;
			const {
				data: { accessToken, refreshToken }
			} = await authAPIClient.login(
				{
					username: username,
					password: password
				},
				{ skipAuthRefresh: true }
			);

			saveAccessToken(accessToken);
			saveRefreshToken(refreshToken);
			storedUsername.value = username;

			toastStore.showToast({ message: 'Úspěšně přihlášeno.', type: 'success' });
			await reloadProfile();
			await router.push('/');
		} catch (err) {
			toastStore.showToast({ message: 'Nesprávné přihlašovací údaje!', type: 'error' });
			resetTokens();
		} finally {
			isLoggingIn.value = false;
		}
	};

	const logout = () => {
		resetTokens();
		state.user = null;
		storedUsername.value = null;
		toastStore.showToast({ message: 'Byl jste úspěšně odhlášen.', type: 'success' });
	};

	return {
		currentUser: computed(() => state.user),
		isLoggingIn,
		isLoggedIn,
		isCurrentUserLoaded,
		permissions,
		hasPermission,
		login,
		logout,
		reloadProfile
	};
}
