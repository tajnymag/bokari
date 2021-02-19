<template>
	<v-card class="pa-5">
		<v-form ref="form" v-on:submit.prevent="submit">
			<v-card-text>
				<v-text-field
					label="Název"
					:rules="[isRequired]"
					class="required"
					v-model="contract.name"
				/>
				<v-text-field
					label="Číslo"
					:rules="[isPattern(/^\d{5}$/)]"
					clearable
					v-model="contract.code"
				/>
				<date-picker
					label="Datum začátku"
					:rules="[isRequired]"
					v-model="contract.startAt"
				/>
				<date-picker
					label="Datum odevzdání"
					:rules="[isRequired]"
					class="required"
					v-model="contract.deadlineAt"
				/>
				<v-switch label="Hotova" v-model="contract.isDone" />
				<v-text-field
					label="Cena"
					inputmode="decimal"
					:rules="[isNumber]"
					class="required"
					v-model="contract.price.amount"
				/>
				<v-autocomplete
					label="Měna"
					:items="currencies"
					class="required"
					v-model="contract.price.currency"
				/>
				<v-autocomplete
					label="Klient"
					:items="customers"
					class="required"
					item-text="person.name"
					return-object
					:rules="[hasNonDefaultId]"
					:loading="loadingCustomers"
					v-model="contract.customer"
				/>
				<v-textarea label="Popis" clearable v-model="contract.description" />
			</v-card-text>

			<v-card-actions>
				<v-spacer />
				<v-btn text type="submit" color="primary">Uložit</v-btn>
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
			name: undefined,
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
