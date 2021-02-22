<template>
	<v-card>
		<v-card-actions>
			<v-spacer />
			<v-btn text color="primary" to="/new-customer">Vytvořit nového klienta</v-btn>
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
				:loading="loading"
				:items="customers"
				:headers="headers"
				:search="searchInput"
			>
				<template v-slot:item.contracts="{ item }">
					<span>{{ item.contracts.length }}</span>
				</template>
				<template v-slot:item.actions="{ item }">
					<v-btn icon :to="{ name: 'Customer', params: { customerId: item.id } }">
						<v-icon>mdi-eye</v-icon>
					</v-btn>
				</template>
			</v-data-table>
		</v-card-text>
	</v-card>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { asyncComputed, useTitle } from '@vueuse/core';

import { customersAPIClient } from '../http/api';
import { VDataTableHeader } from '../plugins/vuetify';
import { useToastStore } from '../stores/toast.store';

export default defineComponent({
	name: 'CustomerList',
	setup() {
		useTitle('Klienti');
		const { showToast } = useToastStore();

		const loading = ref(true);
		const customers = asyncComputed(
			async () => {
				try {
					return await customersAPIClient.getAllCustomers().then(res => res.data);
				} catch {
					showToast({ message: 'Nepodařilo se načíst seznam klientů', type: 'error' });
				}
			},
			[],
			loading
		);

		const headers: VDataTableHeader[] = [
			{
				text: 'Jméno',
				value: 'person.name'
			},
			{
				text: 'Počet zakázek',
				value: 'contracts'
			},
			{
				text: 'Možnosti',
				value: 'actions'
			}
		];

		const searchInput = ref('');

		return {
			loading,
			customers,
			headers,
			searchInput
		};
	}
});
</script>

<style scoped></style>
