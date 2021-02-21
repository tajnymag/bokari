<template>
	<v-card>
		<v-card-actions v-if="hasPermission(Permission.CONTRACTS_WRITE)">
			<v-spacer />
			<v-btn color="primary" text to="/new-contract">Vytvořit novou zakázku</v-btn>
			<v-spacer />
		</v-card-actions>

		<v-card-text>
			<v-text-field
				v-model="searchInput"
				append-icon="mdi-magnify"
				class="pa-2"
				clearable
				hide-details
				label="Vyhledat"
				singe-line
			/>

			<v-data-table
				:headers="headers"
				:items="contracts"
				:items-per-page.sync="itemsPerPage"
				:loading="loading"
				:page.sync="page"
			>
				<template v-slot:item.deadlineAt="{ item }">
					<span>{{ d(item.deadlineAt) }}</span>
				</template>

				<template v-slot:item.actions="{ item }">
					<v-btn icon @click="openContractView(item)">
						<v-icon>mdi-eye</v-icon>
					</v-btn>
					<v-btn icon @click="deleteContract(item)">
						<v-icon>mdi-delete</v-icon>
					</v-btn>
				</template>
			</v-data-table>
		</v-card-text>
	</v-card>
</template>

<script lang="ts">
import { Contract } from '@bokari/api-client';
import { Permission } from '@bokari/entities';
import { computed, defineComponent, ref } from '@vue/composition-api';
import { asyncComputed, useDebounce, useTitle } from '@vueuse/core';

import { contractsAPIClient } from '../http/api';
import { useTypedI18n } from '../plugins/i18n';
import { VDataTableHeader } from '../plugins/vuetify';
import { useRouter } from '../router';
import { useCurrentUserStore } from '../stores/current-user.store';
import { useToastStore } from '../stores/toast.store';

export default defineComponent({
	name: 'ContractListView',
	setup() {
		useTitle('Zakázky');
		const { hasPermission } = useCurrentUserStore();
		const { showToast } = useToastStore();

		const searchInput = ref('');
		const debouncedSearchInput = useDebounce(searchInput);
		const typesafeSearch = computed(() => debouncedSearchInput.value ?? undefined);
		const loading = ref(true);
		const page = ref(1);
		const itemsPerPage = ref(10);
		const headers = ref<VDataTableHeader[]>([
			{
				text: 'Číslo',
				value: 'code'
			},
			{
				text: 'Název',
				value: 'name'
			},
			{
				text: 'Klient',
				value: 'customer.person.name'
			},
			{
				text: 'Uzávěrka',
				value: 'deadlineAt'
			},
			{
				text: 'Možnosti',
				value: 'actions'
			}
		]);

		const contracts = asyncComputed(
			() =>
				contractsAPIClient
					.getAllContracts(
						itemsPerPage.value < 0 ? undefined : itemsPerPage.value,
						page.value,
						typesafeSearch.value
					)
					.then(res => res.data),
			[],
			loading
		);

		const router = useRouter();
		const openContractView = (contract: Contract) => {
			router.push({ name: 'Contract', params: { contractCode: contract.code } });
		};

		const deleteContract = async (contract: Contract) => {
			try {
				await contractsAPIClient.deleteContractByCode(contract.code);
				showToast({
					message: `Zakázka ${contract.code} byla úspěšně odebrána`,
					type: 'success'
				});
			} catch {
				showToast({
					message: `Nepodařilo se odebrat zakázku ${contract.code}`,
					type: 'error'
				});
			}
		};

		return {
			loading,
			contracts,
			headers,
			searchInput,
			page,
			itemsPerPage,
			openContractView,
			hasPermission,
			deleteContract,
			Permission,
			...useTypedI18n()
		};
	}
});
</script>

<style scoped></style>
