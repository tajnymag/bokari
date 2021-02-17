import { User } from '@bokari/api-client';
import { computed, reactive, ref } from '@vue/composition-api';
import { Permission } from '@bokari/entities';
import { resetTokens, saveAccessToken, saveRefreshToken } from '@/http/auth';
import { useToastStore } from '@/stores/toast.store';
import { authAPIClient, usersAPIClient } from '@/http/api';
import { useRouter } from '@/router';

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

	const isLoggingIn = ref<boolean>(false);
	const isLoggedIn = computed<boolean>(() => !!state.user);
	const permissions = computed<Permission[]>(() => {
		const foundPermissions: Permission[] = [];

		if (!state.user) {
			return [];
		}

		for (const group of state.user.groups) {
			for (const permission of group.permissions) {
				const typedPermission = (permission as unknown) as Permission;
				if (!foundPermissions.includes(typedPermission)) {
					foundPermissions.push(typedPermission);
				}
			}
		}

		return foundPermissions;
	});

	const hasPermission = (permission: Permission): boolean =>
		permissions.value.includes(permission);

	const reloadProfile = async (username?: string) => {
		if (!state.user?.username && !username) {
			toastStore.showToast({ message: 'Uživatel není přihlášen!', type: 'error' });
			return;
		}

		if (!username) {
			toastStore.showToast({
				message: 'Nebylo zadáno validní uživatelské jméno!',
				type: 'error'
			});
			return;
		}

		const { data: user } = await usersAPIClient.getUserByUsername(
			state.user?.username ?? username
		);

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

			toastStore.showToast({ message: 'Úspěšně přihlášeno.', type: 'success' });
			await reloadProfile(username);
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
		toastStore.showToast({ message: 'Byl jste úspěšně odhlášen.', type: 'success' });
	};

	return {
		user: state.user,
		isLoggingIn,
		isLoggedIn,
		permissions,
		hasPermission,
		login,
		logout,
		reloadProfile
	};
}
