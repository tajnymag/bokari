<template>
	<v-card class="pa-5">
		<v-form ref="form" @submit.prevent="submit">
			<v-card-text>
				<v-text-field
					v-model="contract.name"
					:rules="[isRequired]"
					class="required"
					label="Název"
				/>
				<v-text-field
					v-model="contract.code"
					:rules="[isPattern(/^\d{5}$/)]"
					clearable
					label="Číslo"
				/>
				<date-picker
					v-model="contract.startAt"
					:rules="[isRequired]"
					label="Datum začátku"
				/>
				<date-picker
					v-model="contract.deadlineAt"
					:rules="[isRequired]"
					class="required"
					label="Datum odevzdání"
				/>
				<v-switch v-model="contract.isDone" label="Hotova" />
				<v-text-field
					v-model="contract.price.amount"
					:rules="[isNumber]"
					class="required"
					inputmode="decimal"
					label="Cena"
				/>
				<v-autocomplete
					v-model="contract.price.currency"
					:items="currencies"
					class="required"
					label="Měna"
				/>
				<v-autocomplete
					v-model="contract.customer"
					:items="customers"
					:loading="loadingCustomers"
					:rules="[hasNonDefaultId]"
					class="required"
					item-text="person.name"
					label="Klient"
					return-object
				/>
				<v-textarea v-model="contract.description" clearable label="Popis" />
			</v-card-text>

			<v-card-actions>
				<v-spacer />
				<v-btn color="primary" text type="submit">Uložit</v-btn>
			</v-card-actions>
		</v-form>
	</v-card>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from '@vue/composition-api';
import { asyncComputed } from '@vueuse/core';
import { Currency } from '@bokari/entities';
import { ContractInsertable } from '@bokari/api-client';
import { contractsAPIClient, customersAPIClient } from '@/http/api';
import { useToastStore } from '@/stores/toast.store';
import DatePicker from '@/components/DatePicker.vue';
import { useValidation } from '@/utils/validations';
import { VFormElement } from '@/plugins/vuetify';

export default defineComponent({
	name: 'NewContractView',
	components: {
		DatePicker
	},
	setup() {
		const form = ref<VFormElement | null>(null);
		const toastStore = useToastStore();
		const { isRequired, isNumber, isPattern, hasNonDefaultId, validate } = useValidation(form);
		const currencies = Object.values(Currency);

		const contract: ContractInsertable = reactive<ContractInsertable>({
			code: undefined,
			name: '',
			description: '',
			deadlineAt: '',
			startAt: '',
			isDone: false,
			price: {
				amount: 0,
				currency: Currency.CZK
			},
			customer: {
				id: 0
			}
		});

		const loadingCustomers = ref(true);
		const customers = asyncComputed(
			() => customersAPIClient.getAllCustomers().then((res) => res.data),
			[],
			loadingCustomers
		);

		const submit = async () => {
			if (!validate()) {
				toastStore.showToast({
					message: 'Nevyplnili jste všechny potřebné údaje!',
					type: 'warning'
				});
				return;
			}

			contractsAPIClient
				.createContract(contract)
				.then((res) => {
					toastStore.showToast({
						message: `Zakázka s číslem ${res.data.code} byla úspěšně vytvořena!`,
						type: 'success'
					});
				})
				.catch(() => {
					toastStore.showToast({
						message: 'Nepodařilo se vytvořit danou zakázku!',
						type: 'error'
					});
				});
		};

		return {
			contract,
			customers,
			currencies,
			loadingCustomers,
			isNumber,
			isRequired,
			isPattern,
			hasNonDefaultId,
			form,
			submit
		};
	}
});
</script>

<style scoped></style>
