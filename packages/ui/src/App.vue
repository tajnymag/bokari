<template>
	<v-app>
		<v-app-bar app color="primary" dark>
			<v-app-bar-nav-icon @click="drawer = !drawer" />
			<v-toolbar-title>
				{{ title }}
			</v-toolbar-title>

			<v-spacer />

			<portal-target name="app-toolbar-buttons" />
		</v-app-bar>

		<v-navigation-drawer v-model="drawer" app>
			<v-list-item>
				<v-list-item-avatar>
					<v-img
						v-if="isCurrentUserLoaded && currentUser.avatar"
						:src="currentUser.avatar.url"
					/>
				</v-list-item-avatar>

				<v-list-item-content>
					<v-list-item-title>
						{{ isCurrentUserLoaded ? currentUser.person.name : 'Nepřihlášen' }}
					</v-list-item-title>
				</v-list-item-content>
			</v-list-item>

			<v-divider />

			<v-list>
				<v-list-item-group>
					<v-list-item v-if="hasPermission(Permission.CONTRACTS_READ)" to="/contracts">
						<v-list-item-icon>
							<v-icon>mdi-file</v-icon>
						</v-list-item-icon>
						<v-list-item-title>Zakázky</v-list-item-title>
					</v-list-item>

					<v-list-item v-if="isLoggedIn" to="/customers">
						<v-list-item-icon>
							<v-icon>mdi-card-account-details</v-icon>
						</v-list-item-icon>
						<v-list-item-title>Klienti</v-list-item-title>
					</v-list-item>

					<v-list-item v-if="hasPermission(Permission.USERS_READ)" to="/users">
						<v-list-item-icon>
							<v-icon>mdi-account-multiple</v-icon>
						</v-list-item-icon>
						<v-list-item-title>Uživatelé</v-list-item-title>
					</v-list-item>

					<v-list-item v-if="hasPermission(Permission.GROUPS_READ)" to="/groups">
						<v-list-item-icon>
							<v-icon>mdi-account-group</v-icon>
						</v-list-item-icon>
						<v-list-item-title>Skupiny</v-list-item-title>
					</v-list-item>

					<v-list-item v-if="!isLoggedIn" to="/login">
						<v-list-item-icon>
							<v-icon>mdi-account-arrow-left</v-icon>
						</v-list-item-icon>
						<v-list-item-title>Přihlášení</v-list-item-title>
					</v-list-item>

					<v-list-item to="/about">
						<v-list-item-icon>
							<v-icon>mdi-information</v-icon>
						</v-list-item-icon>
						<v-list-item-title>O aplikaci</v-list-item-title>
					</v-list-item>
				</v-list-item-group>
			</v-list>

			<template v-if="isLoggedIn" v-slot:append>
				<v-btn block @click="logout">Odhlásit</v-btn>
			</template>
		</v-navigation-drawer>

		<v-main class="grey lighten-3">
			<v-container>
				<router-view />
			</v-container>
		</v-main>

		<app-toast-container />

		<v-footer app></v-footer>
	</v-app>
</template>

<script lang="ts">
import { Permission } from '@bokari/entities';
import { defineComponent, ref } from '@vue/composition-api';
import { useTitle } from '@vueuse/core';

import AppToastContainer from './components/AppToastContainer.vue';
import { useCurrentUserStore } from './stores/current-user.store';

export default defineComponent({
	name: 'App',
	components: {
		AppToastContainer
	},
	setup() {
		const title = useTitle('Bokari');
		const drawer = ref<boolean | null>(null);
		const {
			isLoggedIn,
			isCurrentUserLoaded,
			hasPermission,
			logout,
			reloadProfile,
			currentUser
		} = useCurrentUserStore();

		reloadProfile();

		new MutationObserver(function(mutations) {
			title.value = mutations[0].target.textContent;
		}).observe(document.querySelector('title') as HTMLTitleElement, {
			characterData: true,
			childList: true
		});

		return {
			drawer,
			title,
			isLoggedIn,
			isCurrentUserLoaded,
			currentUser,
			hasPermission,
			Permission,
			logout
		};
	}
});
</script>

<style>
.required label::after {
	content: '*';
}

.clickable {
	cursor: pointer;
}
</style>
