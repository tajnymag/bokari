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
import { useRouter } from '@/router';
import { Contract } from '@bokari/entities';
import { plainToClass } from 'class-transformer';
import { contractsAPIClient } from '@/http/api';

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
				value: 'customer.name'
			},
			{
				text: 'Uzávěrka',
				value: 'deadlineAt'
			}
		]);

		const router = useRouter();
		const handleClick = (row: Contract) => {
			if (row.code) {
				router.push({ name: 'Contract', params: { contractCode: row.code.toString() } });
			}
		};

		contractsAPIClient.getAllContracts().then((res) => {
			contracts.value = plainToClass(Contract, res.data);
		});

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
