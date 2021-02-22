<template>
	<v-card class="pa-5">
		<v-form ref="customerForm" @submit.prevent="submit">
			<v-card-text>
				<v-text-field
					v-model="customer.person.name"
					:rules="[isRequired]"
					class="required"
					label="Jméno"
				/>
			</v-card-text>

			<v-card-actions>
				<v-spacer />
				<v-btn color="primary" text type="submit">Uložit</v-btn>
			</v-card-actions>
		</v-form>
	</v-card>
</template>

<script lang="ts">
import { CustomerInsertable } from '@bokari/api-client';
import { defineComponent, reactive, ref } from '@vue/composition-api';
import { useTitle } from '@vueuse/core';

import { customersAPIClient } from '../http/api';
import { VFormElement } from '../plugins/vuetify';
import { useToastStore } from '../stores/toast.store';
import { useValidation } from '../utils/validations';

export default defineComponent({
	name: 'NewCustomerView',
	setup() {
		useTitle('Nový klient');
		const toastStore = useToastStore();
		const customerForm = ref<VFormElement | null>(null);
		const customer = reactive<CustomerInsertable>({
			person: {
				name: '',
				contacts: []
			}
		});
		const { isRequired, validate } = useValidation(customerForm);

		const submit = () => {
			if (!validate()) {
				toastStore.showToast({
					message: 'Nebyla vyplněna všechna potřebná pole!',
					type: 'warning'
				});
				return;
			}

			customersAPIClient
				.createCustomer(customer)
				.then(() => {
					toastStore.showToast({
						message: 'Klient byl úspěšně přidán do databáze.',
						type: 'success'
					});
				})
				.catch(() => {
					toastStore.showToast({
						message: 'Nepodařilo se údaje klienta uložit do databáze.',
						type: 'error'
					});
				});
		};

		return {
			customer,
			isRequired,
			submit,
			customerForm
		};
	}
});
</script>

<style scoped></style>
