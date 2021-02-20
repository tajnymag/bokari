<template>
	<v-card>
		<v-card-title>
			<h2 class="text-h2">Zakázky</h2>
		</v-card-title>

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
				:item-class="rowClass"
				:items="contracts"
				:items-per-page.sync="itemsPerPage"
				:loading="loading"
				:page.sync="page"
				@click:row="handleClick"
			>
				<template v-slot:item.deadlineAt="{ item }">
					<span>{{ d(item.deadlineAt) }}</span>
				</template>
			</v-data-table>
		</v-card-text>
	</v-card>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from '@vue/composition-api';
import { useRouter } from '@/router';
import { Contract, Permission } from '@bokari/entities';
import { contractsAPIClient } from '@/http/api';
import { asyncComputed, useDebounce } from '@vueuse/core';
import { VDataTableHeader } from '@/plugins/vuetify';
import { useCurrentUserStore } from '@/stores/current-user.store';
import { useTypedI18n } from '@/plugins/i18n';

export default defineComponent({
	name: 'ContractListView',
	setup() {
		const searchInput = ref('');
		const debouncedSearchInput = useDebounce(searchInput);
		const typesafeSearch = computed(() => debouncedSearchInput.value ?? undefined);
		const loading = ref(true);
		const page = ref(1);
		const itemsPerPage = ref(10);
		const rowClass = () => 'clickable';
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
					.then((res) => res.data),
			[],
			loading
		);

		const router = useRouter();
		const handleClick = (row: Contract) => {
			if (row.code) {
				router.push({ name: 'Contract', params: { contractCode: row.code.toString() } });
			}
		};

		const { hasPermission } = useCurrentUserStore();

		return {
			loading,
			contracts,
			headers,
			searchInput,
			page,
			itemsPerPage,
			handleClick,
			rowClass,
			hasPermission,
			Permission,
			...useTypedI18n()
		};
	}
});
</script>

<style scoped></style>
