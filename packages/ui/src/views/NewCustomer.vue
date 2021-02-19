<template>
	<v-card class="pa-5">
		<v-form v-on:submit.prevent="submit">
			<v-card-text>
				<v-text-field
					label="Jméno"
					:rules="[isRequired]"
					class="required"
					v-model="customer.person.name"
				/>
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
import { CustomerInsertable } from '@bokari/api-client';
import { useToastStore } from '@/stores/toast.store';
import { customersAPIClient } from '@/http/api';
import ContactInput from '@/components/ContactInput.vue';
import { VFormElement } from '@/plugins/vuetify';
import { useValidation } from '@/utils/validations';
import ContactList from '@/components/ContactList.vue';

export default defineComponent({
	name: 'NewCustomerView',
	components: {
		ContactList
	},
	setup() {
		const toastStore = useToastStore();
		const form = ref<VFormElement | null>(null);
		const customer = reactive<CustomerInsertable>({
			person: {
				name: '',
				contacts: []
			}
		});
		const { isRequired, validate } = useValidation(form);

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
			submit
		};
	}
});
</script>

<style scoped></style>
