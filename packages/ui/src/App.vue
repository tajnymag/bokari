<template>
	<v-app>
		<v-app-bar app>
			<v-app-bar-nav-icon @click="drawer = !drawer" />
			<v-toolbar-title>
				<v-btn to="/" text>
					<h1>Bokari</h1>
				</v-btn>
			</v-toolbar-title>

			<v-spacer />

			<v-menu bottom left>
				<template v-slot:activator="{ on, attrs }">
					<v-btn icon v-bind="attrs" v-on="on">
						<v-icon>mdi-dots-vertical</v-icon>
					</v-btn>
				</template>

				<v-list>
					<v-list-item>
						<v-list-item-title>Můj účet</v-list-item-title>
					</v-list-item>
					<v-list-item @click="logout()">
						<v-list-item-title>Odhlásit</v-list-item-title>
					</v-list-item>
				</v-list>
			</v-menu>
		</v-app-bar>

		<v-navigation-drawer app v-model="drawer">
			<v-list>
				<v-list-item-group>
					<v-list-item to="/">
						<v-list-item-icon>
							<v-icon>mdi-home</v-icon>
						</v-list-item-icon>
						<v-list-item-title>Domovská strana</v-list-item-title>
					</v-list-item>

					<v-list-item to="/contracts" v-if="hasPermission(Permission.CONTRACTS_READ)">
						<v-list-item-icon>
							<v-icon>mdi-file</v-icon>
						</v-list-item-icon>
						<v-list-item-title>Zakázky</v-list-item-title>
					</v-list-item>

					<v-list-item to="/login">
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
		const { isLoggedIn, hasPermission, logout } = useCurrentUserStore();

		return {
			drawer,
			isLoggedIn,
			hasPermission,
			Permission,
			logout
		};
	}
});
</script>

<style>
.clickable {
	cursor: pointer;
}
</style>
