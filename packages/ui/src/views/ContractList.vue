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

		<v-data-table :headers="headers" :items="contracts" :search="search" @click:row="handleClick" />
	</v-card>
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { Contract } from '@bokari/shared';
import { useRouter } from '@/router';

export default defineComponent({
	name: 'ContractList',
	setup() {
		const search = ref('');
		const contracts = ref<Contract[]>([
			{
				id: 1,
				code: '202001',
				client: {
					id: 1,
					name: 'Marek Lukáš'
				},
				comments: [],
				deadlineAt: new Date(),
				description: 'asdasd ada asd',
				files: [],
				isDone: false,
				levels: [
					{
						deadlineAt: new Date(),
						isDone: false,
						name: 'Stavební úřad',
						startAt: new Date()
					}
				],
				name: 'Testovací zakázka',
				price: {
					amount: 500000,
					createdAt: new Date(),
					currency: 'czk'
				},
				responsibleUser: {
					id: 2,
					name: 'Petr Lukáš',
					username: 'petr.lukas'
				},
				startAt: new Date(),
				subcontracts: []
			},
			{
				id: 5,
				code: '201906',
				client: {
					id: 1,
					name: 'Marek Lukáš'
				},
				comments: [],
				deadlineAt: new Date(-1),
				description: 'asdasd ada asd',
				files: [],
				isDone: false,
				levels: [
					{
						deadlineAt: new Date(),
						isDone: false,
						name: 'Stavební úřad',
						startAt: new Date()
					}
				],
				name: 'Jiná zakázka',
				price: {
					amount: 500000,
					createdAt: new Date(),
					currency: 'czk'
				},
				responsibleUser: {
					id: 2,
					name: 'Petr Lukáš',
					username: 'petr.lukas'
				},
				startAt: new Date(),
				subcontracts: []
			}
		]);
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
		const handleClick = (row) => router.push({ name: 'Contract', params: { id: row.id } });

		return {
			contracts,
			headers,
			search,
			handleClick
		};
	}
});
</script>

<style scoped></style>
