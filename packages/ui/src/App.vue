<template>
	<v-app>
		<v-app-bar app>
			<v-app-bar-nav-icon @click="drawer = !drawer" />
			<v-toolbar-title>
				<v-btn text to="/">
					<h1>Bokari</h1>
				</v-btn>
			</v-toolbar-title>

			<v-spacer />

			<v-menu bottom left>
				<template v-slot:activator="{ on, attrs }">
					<v-btn v-bind="attrs" icon v-on="on">
						<v-icon>mdi-dots-vertical</v-icon>
					</v-btn>
				</template>

				<v-list>
					<v-list-item @click="logout()">
						<v-list-item-title>Odhlásit</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
		</v-app-bar>

		<v-navigation-drawer v-model="drawer" app>
			<v-list-item>
				<v-list-item-avatar>
					<v-img src="https://randomuser.me/api/portraits/men/78.jpg"></v-img>
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
					<v-list-item to="/">
						<v-list-item-icon>
							<v-icon>mdi-home</v-icon>
						</v-list-item-icon>
						<v-list-item-title>Domovská strana</v-list-item-title>
					</v-list-item>

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
							<v-icon>mdi-card-account-details</v-icon>
						</v-list-item-icon>
						<v-list-item-title>Zaměstnanci</v-list-item-title>
					</v-list-item>

					<v-list-item v-if="hasPermission(Permission.USERS_READ)" to="/groups">
						<v-list-item-icon>
							<v-icon>mdi-card-account-details</v-icon>
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
import { defineComponent, ref } from '@vue/composition-api';
import { Permission } from '@bokari/entities';
import AppToastContainer from '@/components/AppToastContainer.vue';
import { useCurrentUserStore } from '@/stores/current-user.store';

export default defineComponent({
	name: 'App',
	components: {
		AppToastContainer
	},
	setup() {
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

		return {
			drawer,
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
