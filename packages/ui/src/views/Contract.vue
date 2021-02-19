<template>
	<v-card v-if="!loading">
		<v-card-title>
			<h2 class="text-h2">{{ contract.name }}</h2>
		</v-card-title>

		<v-card-subtitle>{{ contract.code }}</v-card-subtitle>

		<v-card-text>
			<v-row>
				<v-col cols="12" md="4">
					<v-card>
						<v-toolbar>
							<v-toolbar-title>Detaily</v-toolbar-title>
							<v-spacer />
							<v-btn icon @click="editable = !editable">
								<v-icon>{{ editable ? 'mdi-pencil-remove' : 'mdi-pencil' }}</v-icon>
							</v-btn>
						</v-toolbar>

						<v-list dense>
							<v-list-item>
								<span>Kód</span>
								<v-spacer />
								<v-text-field
									reverse
									flat
									readonly
									v-model="contract.code"
									class="input-underline-hidden"
								/>
							</v-list-item>

							<v-list-item>
								<span>Vytvořil</span>
								<v-spacer />
								<v-text-field
									reverse
									dense
									flat
									readonly
									v-model="contract.metadata.createdBy.username"
									class="input-underline-hidden"
								/>
							</v-list-item>

							<v-list-item>
								<span>Název</span>
								<v-spacer />
								<v-text-field
									reverse
									dense
									flat
									:readonly="!editable"
									v-model="contract.name"
									v-bind:class="hiddenUnderlineClass"
								/>
							</v-list-item>

							<v-list-item>
								<span>Dokončena</span>
								<v-spacer />
								<v-checkbox
									dense
									flat
									:readonly="!editable"
									v-model="contract.isDone"
									v-bind:class="hiddenUnderlineClass"
								/>
							</v-list-item>

							<v-list-item>
								<span>Klient</span>
								<v-spacer />
								<v-autocomplete
									:items="customers"
									reverse
									dense
									append-icon=""
									flat
									:readonly="!editable"
									item-text="person.name"
									return-object
									:loading="loadingCustomers"
									v-model="contract.customer"
									v-bind:class="hiddenUnderlineClass"
								/>
							</v-list-item>

							<v-list-item>
								<span>Cena</span>
								<v-spacer />
								<v-text-field
									v-if="!editable"
									reverse
									dense
									flat
									readonly
									:value="formattedPrice"
									v-bind:class="hiddenUnderlineClass"
								/>
								<v-row v-else>
									<v-col offset="3">
										<v-text-field
											inputmode="numeric"
											reverse
											dense
											flat
											:readonly="!editable"
											v-model="contract.price.amount"
											v-bind:class="hiddenUnderlineClass"
										/>
									</v-col>
									<v-col>
										<v-autocomplete
											:items="currencies"
											dense
											append-icon=""
											flat
											:readonly="!editable"
											v-model="contract.price.currency"
											v-bind:class="hiddenUnderlineClass"
										/>
									</v-col>
								</v-row>
							</v-list-item>

							<v-list-item>
								<span>Popis</span>
								<v-spacer />
								<v-textarea
									dense
									solo
									flat
									:readonly="!editable"
									v-model="contract.description"
								/>
							</v-list-item>
						</v-list>
					</v-card>
				</v-col>
				<v-col cols="12" md="4">
					<v-card>
						<v-toolbar>
							<v-toolbar-title>Data</v-toolbar-title>
						</v-toolbar>

						<v-list dense>
							<v-list-item>
								<span>Deadline</span>
								<v-spacer />
								<date-picker
									reverse
									flat
									solo
									:disabled="!editable"
									prepend-icon=""
									v-model="contract.deadlineAt"
								/>
							</v-list-item>

							<v-list-item>
								<span>Začátek</span>
								<v-spacer />
								<date-picker
									reverse
									flat
									solo
									:disabled="!editable"
									prepend-icon=""
									v-model="contract.startAt"
								/>
							</v-list-item>
						</v-list>
					</v-card>
				</v-col>
				<v-col>
					<v-card>
						<v-toolbar>
							<v-toolbar-title>Dokumentace</v-toolbar-title>
							<v-spacer />
							<v-btn icon>
								<v-icon>mdi-pencil</v-icon>
							</v-btn>
							<v-btn icon>
								<v-icon>mdi-plus</v-icon>
							</v-btn>
						</v-toolbar>

						<v-card-text>
							<v-data-table
								hide-default-footer
								:items="contract.contractPhases"
								:headers="contractPhasesHeaders"
							></v-data-table>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12">
					<v-card>
						<v-toolbar>
							<v-toolbar-title>Přílohy</v-toolbar-title>
						</v-toolbar>

						<v-card-text v-if="contract.attachments.length < 1">
							U zakázky nejsou zatím žádné přílohy
						</v-card-text>

						<v-row v-for="attachment in contract.attachments" :key="attachment.id">
							<v-col>
								<v-card>
									<v-card-title>
										{{ attachment.metadata.createdBy.username }}
									</v-card-title>
									<v-card-text>
										{{ attachment.note }}
									</v-card-text>
								</v-card>
							</v-col>
						</v-row>
					</v-card>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>

	<v-skeleton-loader v-else type="card-heading, table" />
</template>

<script lang="ts">
import { computed, defineComponent, ref, toRefs } from '@vue/composition-api';
import { useRouter } from '@/router';
import { Contract } from '@bokari/api-client';
import { contractsAPIClient, customersAPIClient } from '@/http/api';
import { asyncComputed } from '@vueuse/core';
import { useI18n } from 'vue-i18n-composable';
import { Currency } from '@bokari/entities';
import DatePicker from '@/components/DatePicker.vue';
import { VDataTableHeader } from '@/plugins/vuetify';

export default defineComponent({
	name: 'ContractView',
	components: {
		DatePicker
	},
	props: {
		contractCode: {
			type: String,
			required: true
		}
	},
	setup(props) {
		const router = useRouter();
		const i18n = useI18n();

		const { contractCode } = toRefs(props);
		const loading = ref(true);
		const editable = ref(false);
		const contract = asyncComputed<Contract | null>(
			() =>
				contractsAPIClient
					.getContractByCode(contractCode.value)
					.then((res) => res.data)
					.catch(() => router.push({ name: 'NotFound' }) && null),
			null,
			loading
		);

		const formattedPrice = computed(() => {
			if (contract?.value?.price) {
				return i18n.n(contract.value.price.amount, {
					key: 'currency',
					currency: contract.value.price.currency
				});
			} else {
				return '';
			}
		});

		const contractPhasesHeaders: VDataTableHeader[] = [
			{
				text: 'Fáze',
				value: 'phase.name'
			},
			{
				text: 'Deadline',
				value: 'deadlineAt'
			},
			{
				text: 'Dokončena',
				value: 'isDone'
			}
		];

		const hiddenUnderlineClass = computed(() => ({
			'input-underline-hidden': !editable.value
		}));

		const loadingCustomers = ref(true);
		const customers = asyncComputed(
			() => customersAPIClient.getAllCustomers().then((res) => res.data),
			[],
			loadingCustomers
		);
		const currencies = Object.values(Currency);

		return {
			contract,
			loading,
			editable,
			loadingCustomers,
			customers,
			currencies,
			formattedPrice,
			hiddenUnderlineClass,
			contractPhasesHeaders,
			...i18n
		};
	}
});
</script>

<style scoped>
.input-underline-hidden >>> .v-input__slot::before {
	border-style: none !important;
}
</style>
