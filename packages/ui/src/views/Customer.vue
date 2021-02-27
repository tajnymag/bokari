<template>
	<v-skeleton-loader v-if="!customer" type="card-heading, table" />
	<v-card v-else>
		<v-card-text>
			<v-row>
				<v-col cols="12" md="6">
					<v-card>
						<v-toolbar>
							<v-card-title>Detaily</v-card-title>
							<v-spacer />
							<v-btn icon @click="toggleDetailsEditable">
								<v-icon>
									{{ detailsEditable ? 'mdi-content-save' : 'mdi-pencil' }}
								</v-icon>
							</v-btn>
						</v-toolbar>

						<v-card-text>
							<v-form :readonly="!detailsEditable">
								<v-text-field v-model="customer.person.name" label="Jméno" />
							</v-form>
						</v-card-text>
					</v-card>
				</v-col>

				<v-col cols="12" md="6">
					<contact-list-card v-model="customer.person.contacts" :person-id="customer.person.id" />
				</v-col>

				<v-col cols="12">
					<v-card>
						<v-toolbar>
							<v-card-title>Zakázky</v-card-title>
						</v-toolbar>

						<v-card-text>
							<v-data-iterator :items="customer.contracts" hide-default-footer>
								<template v-slot:default="{ items }">
									<v-list>
										<v-list-item
											v-for="contract in items"
											:key="contract.id"
											:to="{
												name: 'Contract',
												params: { contractCode: contract.code }
											}"
										>
											<v-list-item-title>
												{{ contract.code }}
											</v-list-item-title>
											<v-list-item-subtitle>
												{{ contract.name }}
											</v-list-item-subtitle>
										</v-list-item>
									</v-list>
								</template>
							</v-data-iterator>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script lang="ts">
import { Customer } from '@bokari/api-client';
import { defineComponent, ref, watchEffect } from '@vue/composition-api';
import { asyncComputed, useTitle } from '@vueuse/core';

import ContactListCard from '../components/ContactListCard.vue';
import { customersAPIClient, peopleAPIClient } from '../http/api';
import { useRouter } from '../router';
import { useToastStore } from '../stores/toast.store';

export default defineComponent({
	name: 'Customer',
	props: {
		customerId: {
			type: Number,
			required: true
		}
	},
	components: {
		ContactListCard
	},
	setup(props) {
		const title = useTitle('Klient');
		const { showToast } = useToastStore();
		const router = useRouter();

		const loading = ref(true);
		const customer = asyncComputed<Customer | null>(
			async () => {
				try {
					return customersAPIClient.getCustomerById(props.customerId).then(res => res.data);
				} catch {
					await router.push('/404');
					return null;
				}
			},
			null,
			loading
		);

		const detailsEditable = ref(false);
		const toggleDetailsEditable = async () => {
			detailsEditable.value = !detailsEditable.value;

			if (!detailsEditable.value && customer.value?.person) {
				try {
					await peopleAPIClient.editPerson(customer.value.person.id, customer.value.person);
					showToast({
						message: 'Jméno klienta bylo úspěšně aktualizováno.',
						type: 'success'
					});
				} catch {
					showToast({
						message: 'Nepodařilo se aktualizovat jméno klienta.',
						type: 'error'
					});
				}
			}
		};

		watchEffect(() => {
			if (customer.value?.person) {
				title.value = customer.value.person.name;
			}
		});

		return {
			customer,
			detailsEditable,
			loading,
			toggleDetailsEditable
		};
	}
});
</script>

<style scoped></style>
