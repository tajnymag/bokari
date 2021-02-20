<template>
	<v-card v-if="!loading">
		<v-card-title>
			<h2 class="text-h2">{{ contract.name }}</h2>
		</v-card-title>

		<v-card-subtitle>{{ contract.code }}</v-card-subtitle>

		<v-card-text>
			<v-row>
				<v-col cols="12" md="6">
					<v-card>
						<v-toolbar>
							<v-toolbar-title>{{ t('contract.details') }}</v-toolbar-title>
							<v-spacer />
							<v-btn icon @click="toggleDetailsEditable">
								<v-icon>
									{{ detailsEditable ? 'mdi-pencil-remove' : 'mdi-pencil' }}
								</v-icon>
							</v-btn>
						</v-toolbar>

						<v-list dense>
							<v-list-item>
								<span>{{ t('contract.code') }}</span>
								<v-spacer />
								<v-text-field
									v-model="contract.code"
									class="input-underline-hidden"
									flat
									readonly
									reverse
								/>
							</v-list-item>

							<v-list-item>
								<span>{{ t('contract.createdBy') }}</span>
								<v-spacer />
								<v-text-field
									v-model="contract.metadata.createdBy.username"
									class="input-underline-hidden"
									dense
									flat
									readonly
									reverse
								/>
							</v-list-item>

							<v-list-item>
								<span>Název</span>
								<v-spacer />
								<v-text-field
									v-model="contract.name"
									:readonly="!detailsEditable"
									dense
									flat
									reverse
									:class="{ 'input-underline-hidden': !detailsEditable }"
								/>
							</v-list-item>

							<v-list-item>
								<span>Dokončena</span>
								<v-spacer />
								<v-checkbox
									v-model="contract.isDone"
									:readonly="!detailsEditable"
									dense
									flat
									:class="{ 'input-underline-hidden': !detailsEditable }"
								/>
							</v-list-item>

							<v-list-item>
								<span>Klient</span>
								<v-spacer />
								<v-autocomplete
									v-model="contract.customer"
									:items="customers"
									:loading="loadingCustomers"
									:readonly="!detailsEditable"
									append-icon=""
									dense
									flat
									item-text="person.name"
									return-object
									reverse
									:class="{ 'input-underline-hidden': !detailsEditable }"
								/>
							</v-list-item>

							<v-list-item>
								<span>Cena</span>
								<v-spacer />
								<v-text-field
									v-if="!detailsEditable"
									:value="formattedPrice"
									class="input-underline-hidden"
									dense
									flat
									readonly
									reverse
								/>
								<v-row v-else>
									<v-col offset="3">
										<v-text-field
											v-model="contract.price.amount"
											:readonly="!detailsEditable"
											dense
											flat
											inputmode="numeric"
											reverse
											:class="{
												'input-underline-hidden': !detailsEditable
											}"
										/>
									</v-col>
									<v-col>
										<v-autocomplete
											v-model="contract.price.currency"
											:items="currencies"
											:readonly="!detailsEditable"
											append-icon=""
											dense
											flat
											reverse
											:class="{
												'input-underline-hidden': !detailsEditable
											}"
										/>
									</v-col>
								</v-row>
							</v-list-item>

							<v-list-item>
								<span>Popis</span>
								<v-spacer />
								<v-textarea
									v-model="contract.description"
									:readonly="!detailsEditable"
									dense
									flat
									solo
								/>
							</v-list-item>
						</v-list>
					</v-card>
				</v-col>
				<v-col cols="12" md="6">
					<v-card>
						<v-toolbar>
							<v-toolbar-title>Data</v-toolbar-title>
							<v-spacer />
							<v-btn icon @click="toggleDatesEditable">
								<v-icon>
									{{ datesEditable ? 'mdi-pencil-remove' : 'mdi-pencil' }}
								</v-icon>
							</v-btn>
						</v-toolbar>

						<v-list dense>
							<v-list-item>
								<span>Deadline</span>
								<v-spacer />
								<v-text-field
									v-model="deadlineAt"
									:readonly="!datesEditable"
									reverse
									type="date"
									:class="{
										'input-underline-hidden': !datesEditable
									}"
								/>
							</v-list-item>

							<v-list-item>
								<span>Začátek</span>
								<v-spacer />
								<v-text-field
									v-model="startAt"
									:readonly="!datesEditable"
									reverse
									type="date"
									:class="{
										'input-underline-hidden': !datesEditable
									}"
								/>
							</v-list-item>
						</v-list>
					</v-card>
				</v-col>
				<v-col cols="12" md="6">
					<v-card>
						<v-toolbar>
							<v-toolbar-title>Dokumentace</v-toolbar-title>
							<v-spacer />
							<v-dialog v-model="newContractPhaseDialogVisible" max-width="500px">
								<template v-slot:activator="{ on, attrs }">
									<v-btn v-bind="attrs" icon v-on="on">
										<v-icon>mdi-pencil</v-icon>
									</v-btn>
								</template>

								<v-card>
									<v-card-title>Upravit nebo vytvořit fázi</v-card-title>

									<v-card-text>
										<v-form ref="contractPhaseForm">
											<v-text-field
												v-model="newContractPhase.deadlineAt"
												:rules="[isRequired]"
												label="Deadline"
												type="date"
											/>
											<v-checkbox
												v-model="newContractPhase.isDone"
												label="Dokončena"
											/>
											<v-select
												v-model="newContractPhase.phase"
												:rules="[hasNonDefaultId]"
												:items="phases"
												item-text="name"
												label="Fáze"
												return-object
											>
												<template v-slot:append-outer>
													<v-dialog
														v-model="newPhaseDialogVisible"
														max-width="350px"
													>
														<template v-slot:activator="{ on, attrs }">
															<v-btn v-bind="attrs" icon v-on="on">
																<v-icon>mdi-plus</v-icon>
															</v-btn>
														</template>

														<v-card>
															<v-card-title>Nová fáze</v-card-title>

															<v-card-text>
																<v-form ref="phaseForm">
																	<v-text-field
																		v-model="newPhase.name"
																		:rules="[isRequired]"
																		label="Název fáze"
																	/>
																</v-form>
															</v-card-text>

															<v-card-actions>
																<v-spacer />
																<v-btn
																	:loading="creatingNewPhase"
																	color="primary"
																	text
																	@click="createNewPhase"
																>
																	Vytvořit
																</v-btn>
															</v-card-actions>
														</v-card>
													</v-dialog>
												</template>
											</v-select>
										</v-form>
									</v-card-text>

									<v-card-actions>
										<v-spacer />
										<v-btn color="primary" text @click="createNewContractPhase">
											Uložit
										</v-btn>
									</v-card-actions>
								</v-card>
							</v-dialog>
						</v-toolbar>

						<v-card-text>
							<v-data-table
								:headers="contractPhasesHeaders"
								:items="contract.contractPhases"
								hide-default-footer
							>
								<template v-slot:item.isDone="{ item }">
									<v-checkbox v-model="item.isDone" readonly />
								</template>
								<template v-slot:item.deadlineAt="{ item }">
									<span>{{ d(item.deadlineAt) }}</span>
								</template>
							</v-data-table>
						</v-card-text>
					</v-card>
				</v-col>
				<v-col cols="12" md="6">
					<v-card>
						<v-toolbar>
							<v-toolbar-title>Přílohy</v-toolbar-title>
						</v-toolbar>

						<v-card-text>
							<span v-if="contract.attachments.length < 1">
								U zakázky nejsou zatím žádné přílohy. Můžete vytvořit novou.
							</span>
							<v-row v-for="attachment in contract.attachments" :key="attachment.id">
								<v-col>
									<v-card>
										<v-card-title>
											{{ attachment.metadata.createdBy.username }}
										</v-card-title>
										<v-card-subtitle v-if="attachment.file">
											<span>Přiložený soubor:</span>
											<v-btn :href="attachment.file.url">
												{{ attachment.file.filename }}
											</v-btn>
										</v-card-subtitle>
										<v-card-text>
											{{ attachment.note }}
										</v-card-text>
									</v-card>
								</v-col>
							</v-row>
						</v-card-text>

						<v-card-text>
							<v-card flat>
								<v-card-title>Nová příloha</v-card-title>
								<v-card-text>
									<v-file-input
										prepend-icon=""
										append-icon="mdi-paperclip"
										label="Přiložit soubor"
									/>
									<v-textarea label="Komentář k příloze" />
								</v-card-text>
								<v-card-actions>
									<v-spacer />
									<v-btn text color="primary">Vytvořit</v-btn>
								</v-card-actions>
							</v-card>
						</v-card-text>
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
import {
	Contract,
	ContractPhase,
	ContractPhaseInsertable,
	Customer,
	Phase,
	PhaseInsertable
} from '@bokari/api-client';
import {
	contractPhasesAPIClient,
	contractsAPIClient,
	customersAPIClient,
	phaseAPIClient
} from '@/http/api';
import { asyncComputed } from '@vueuse/core';
import { Currency } from '@bokari/entities';
import DatePicker from '@/components/DatePicker.vue';
import { VDataTableHeader, VFormElement } from '@/plugins/vuetify';
import { useTypedI18n } from '@/plugins/i18n';
import { useToastStore } from '@/stores/toast.store';
import { useValidation } from '@/utils/validations';

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
		const { contractCode } = toRefs(props);
		const router = useRouter();
		const { showToast } = useToastStore();
		const i18n = useTypedI18n();

		const phaseForm = ref<VFormElement | null>(null);
		const contractPhaseForm = ref<VFormElement | null>(null);
		const { validate: validatePhaseForm } = useValidation(phaseForm);
		const { isRequired, hasNonDefaultId, validate: validateContractPhaseForm } = useValidation(
			contractPhaseForm
		);

		const loading = ref(true);
		const contract = asyncComputed<Contract | null>(
			() =>
				contractsAPIClient
					.getContractByCode(contractCode.value)
					.then((res) => res.data)
					.catch(() => router.push({ name: 'NotFound' }) && null),
			null,
			loading
		);

		const detailsEditable = ref(false);
		const datesEditable = ref(false);

		const formattedPrice = computed(
			() =>
				i18n.n(contract.value?.price?.amount || 0, {
					key: 'currency',
					currency: contract?.value?.price?.currency || 'CZK'
				}) || ''
		);

		const deadlineAt = computed({
			get: () => new Date(contract.value?.deadlineAt || '').toISOString().substr(0, 10),
			set: (value: string) => (contract.value ? (contract.value.deadlineAt = value) : '')
		});

		const startAt = computed({
			get: () => new Date(contract.value?.startAt || '').toISOString().substr(0, 10),
			set: (value: string) => (contract.value ? (contract.value.startAt = value) : '')
		});

		const newContractPhaseDialogVisible = ref(false);
		const newContractPhase = ref<ContractPhase>({
			phase: {
				id: 0,
				name: ''
			},
			deadlineAt: '',
			isDone: false
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
		const savingContractPhases = ref(false);
		const saveContractPhases = async () => {
			savingContractPhases.value = true;
			const contractsToSave: ContractPhaseInsertable[] =
				contract.value?.contractPhases.map((cp) => ({
					phaseId: cp.phase.id,
					deadlineAt: cp.deadlineAt,
					isDone: cp.isDone
				})) || [];
			return contractPhasesAPIClient
				.editContractPhases(contractCode.value, contractsToSave || [])
				.catch((res) => {
					showToast({ message: 'Fáze zakázky byly aktualizovány.', type: 'success' });
				})
				.catch(() => {
					showToast({
						message: 'Fáze zakázky se nepodařilo aktualizovat.',
						type: 'error'
					});
				})
				.finally(() => {
					savingContractPhases.value = false;
					newContractPhase.value = {
						phase: {
							id: 0,
							name: ''
						},
						deadlineAt: '',
						isDone: false
					};
				});
		};
		const createNewContractPhase = async () => {
			if (!contract.value?.contractPhases || !validateContractPhaseForm()) {
				return;
			}
			contract.value.contractPhases = contract.value.contractPhases.filter(
				(cp) => cp.phase.id !== newContractPhase.value.phase.id
			);
			contract.value.contractPhases.push(newContractPhase.value);

			await saveContractPhases();
			newContractPhaseDialogVisible.value = false;
		};

		const loadingCustomers = ref(true);
		const customers = asyncComputed<Customer[]>(
			() => customersAPIClient.getAllCustomers().then((res) => res.data),
			[],
			loadingCustomers
		);

		const currencies = Object.values(Currency);

		const loadingPhases = ref(true);
		const phases = asyncComputed<Phase[]>(
			() => phaseAPIClient.getAllPhases().then((res) => res.data),
			[],
			loadingPhases
		);
		const newPhase = ref<PhaseInsertable>({
			name: ''
		});
		const newPhaseDialogVisible = ref(false);
		const creatingNewPhase = ref(false);
		const createNewPhase = async () => {
			if (!newPhase.value.name || !validatePhaseForm()) {
				return;
			}
			creatingNewPhase.value = true;
			return phaseAPIClient
				.createPhase({ name: newPhase.value.name })
				.then((res) => {
					phases.value.push(res.data);
					showToast({ message: 'Fáze byla úspěšně vytvořena.', type: 'success' });
				})
				.catch(() => {
					showToast({ message: 'Fázi se nepodařilo vytvořit.', type: 'error' });
				})
				.finally(() => {
					creatingNewPhase.value = false;
					newPhase.value.name = '';
					newPhaseDialogVisible.value = false;
				});
		};

		const savingContract = ref(false);
		const saveContract = async () => {
			if (!contract.value) return;

			savingContract.value = true;
			return contractsAPIClient
				.editContract(contractCode.value, contract.value)
				.then((res) => {
					showToast({ message: 'Zakázka byla úspěšně upravena.', type: 'success' });
				})
				.catch(() => {
					showToast({ message: 'Zakázku se nepodařilo upravit.', type: 'error' });
				})
				.finally(() => {
					savingContract.value = false;
					detailsEditable.value = false;
					datesEditable.value = false;
					newContractPhase.value = {
						phase: {
							id: 0,
							name: ''
						},
						deadlineAt: '',
						isDone: false
					};
				});
		};

		const reloadContract = async () => {
			loading.value = true;
			return contractsAPIClient
				.getContractByCode(contractCode.value)
				.then((res) => {
					showToast({ message: 'Zakázka byla úspěšně aktualizována.', type: 'success' });
				})
				.catch(() => {
					showToast({ message: 'Zakázku se nepodařilo aktualizovat.', type: 'error' });
				})
				.finally(() => {
					loading.value = false;
					newContractPhase.value = {
						phase: {
							id: 0,
							name: ''
						},
						deadlineAt: '',
						isDone: false
					};
				});
		};

		const toggleDetailsEditable = async () => {
			detailsEditable.value = !detailsEditable.value;
			if (!detailsEditable.value) await saveContract();
		};
		const toggleDatesEditable = async () => {
			datesEditable.value = !datesEditable.value;
			if (!datesEditable.value) await saveContract();
		};

		return {
			contract,
			loading,
			detailsEditable,
			datesEditable,
			loadingCustomers,
			customers,
			currencies,
			deadlineAt,
			startAt,
			formattedPrice,
			contractPhasesHeaders,
			phases,
			newContractPhase,
			newPhase,
			loadingPhases,
			creatingNewPhase,
			createNewPhase,
			savingContract,
			saveContract,
			reloadContract,
			newContractPhaseDialogVisible,
			newPhaseDialogVisible,
			savingContractPhases,
			saveContractPhases,
			createNewContractPhase,
			isRequired,
			hasNonDefaultId,
			contractPhaseForm,
			phaseForm,
			toggleDetailsEditable,
			toggleDatesEditable,
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
