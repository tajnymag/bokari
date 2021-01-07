<template>
	<v-card id="contract-list-view">
		<v-card-title>
			<h2 class="text-h2">Zakázky</h2>
		</v-card-title>

		<v-spacer />

		<v-text-field
			v-model="search"
			append-icon="mdi-magnify"
			label="Vyhledat"
			singe-line
			hide-details
			class="pa-2"
		/>

		<v-data-table
			:headers="headers"
			:items="contracts"
			:search="search"
			:loading="contracts.length < 1"
			:item-class="rowClass"
			@click:row="handleClick"
		/>
	</v-card>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { Contract } from '@bokari/shared';
import { useRouter } from '@/router';
import { getAllContracts } from '../../mock/data';

export default defineComponent({
	name: 'ContractList',
	setup() {
		const search = ref('');
		const contracts = ref<Contract[]>([]);
		const rowClass = () => 'clickable';
		const headers = ref([
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
				value: 'client.name'
			},
			{
				text: 'Uzávěrka',
				value: 'deadlineAt'
			}
		]);

		const router = useRouter();
		const handleClick = (row: Contract) => {
			if (row.id) {
				router.push({ name: 'Contract', params: { id: row.id.toString() } });
			}
		};

		setTimeout(() => {
			contracts.value = getAllContracts();
		}, 1000);

		return {
			contracts,
			headers,
			search,
			handleClick,
			rowClass
		};
	}
});
</script>

<style scoped></style>
