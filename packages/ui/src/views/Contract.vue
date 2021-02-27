<template>
	<v-skeleton-loader v-if="!contract" type="card-heading, table" />
	<v-card v-else>
		<v-card-text>
			<v-row>
				<v-col cols="12" md="6">
					<v-card>
						<v-toolbar>
							<v-toolbar-title>{{ t('contract.details') }}</v-toolbar-title>
							<v-spacer />
							<v-btn icon @click="toggleDetailsEditable">
								<v-icon>
									{{ detailsEditable ? 'mdi-content-save' : 'mdi-pencil' }}
								</v-icon>
							</v-btn>
						</v-toolbar>

						<v-card-text>
							<v-form :readonly="!detailsEditable">
								<v-text-field v-model="contract.name" label="Název" />
								<v-text-field v-model="contract.code" :label="t('contract.code')" readonly />
								<v-text-field
									v-model="contract.metadata.createdBy.username"
									:label="t('contract.createdBy')"
									readonly
								/>
								<v-autocomplete
									v-model="contract.customer"
									label="Klient"
									:items="customers"
									:loading="loadingCustomers"
									append-icon=""
									item-text="person.name"
									return-object
								/>
								<v-text-field
									v-if="!detailsEditable"
									label="Cena"
									:value="formattedPrice"
									readonly
								/>
								<v-text-field
									v-if="detailsEditable"
									v-model="contract.price.amount"
									label="Cena"
									inputmode="numeric"
								/>
								<v-autocomplete
									v-if="detailsEditable"
									v-model="contract.price.currency"
									label="Měna"
									:items="currencies"
								/>
								<v-checkbox v-model="contract.isDone" label="Dokončena" />
								<v-textarea v-model="contract.description" label="Popis" />
							</v-form>
						</v-card-text>
					</v-card>

					<v-card class="mt-6">
						<v-toolbar>
							<v-toolbar-title>Fáze</v-toolbar-title>
							<v-spacer />
							<v-btn icon @click.stop="openEditContractPhaseDialog()">
								<v-icon>mdi-plus</v-icon>
							</v-btn>
							<v-dialog v-model="newContractPhaseDialogVisible" max-width="500px">
								<v-card>
									<v-card-title>Upravit nebo vytvořit fázi</v-card-title>

									<v-card-text>
										<v-form ref="contractPhaseForm">
											<v-text-field
												v-model="newContractPhase.deadlineAt"
												:rules="[isRequired]"
												label="Uzávěrka"
												type="date"
											/>
											<v-checkbox v-model="newContractPhase.isDone" label="Dokončena" />
											<v-select
												v-model="newContractPhase.phase"
												:rules="[hasNonDefaultId]"
												:items="phases"
												item-text="name"
												label="Fáze"
												return-object
											>
												<template v-slot:append-outer>
													<v-dialog v-model="newPhaseDialogVisible" max-width="350px">
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
								<template v-slot:item.actions="{ item }">
									<v-btn icon @click="openEditContractPhaseDialog(item)">
										<v-icon>mdi-pencil</v-icon>
									</v-btn>
									<v-btn icon @click="deleteContractPhase(item)">
										<v-icon>mdi-delete</v-icon>
									</v-btn>
								</template>
							</v-data-table>
						</v-card-text>
					</v-card>
				</v-col>

				<v-col cols="12" md="6">
					<v-card>
						<v-toolbar>
							<v-toolbar-title>Data</v-toolbar-title>
							<v-spacer />
							<v-btn icon @click="toggleDatesEditable">
								<v-icon>
									{{ datesEditable ? 'mdi-content-save' : 'mdi-pencil' }}
								</v-icon>
							</v-btn>
						</v-toolbar>
						<v-card-text>
							<v-form :readonly="!datesEditable">
								<v-text-field v-model="startAt" label="Začátek" type="date" />
								<v-text-field v-model="deadlineAt" label="Uzávěrka" type="date" />
							</v-form>
						</v-card-text>
					</v-card>

					<v-card class="mt-6">
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
										<v-card-title v-if="attachment.metadata.createdBy">
											{{ attachment.metadata.createdBy.username }}
										</v-card-title>
										<v-card-subtitle v-if="attachment.file">
											<span>Přiložený soubor:</span>
											<v-btn text small :href="attachment.file.url">
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
							<v-card flat :loading="creatingNewAttachment">
								<v-card-title class="text-subtitle-1">Nová příloha</v-card-title>
								<v-card-text>
									<v-file-input
										v-model="newAttachment.file"
										prepend-icon=""
										append-icon="mdi-paperclip"
										label="Přiložit soubor"
									/>
									<v-textarea v-model="newAttachment.note" label="Komentář k příloze" />
								</v-card-text>
								<v-card-actions>
									<v-spacer />
									<v-btn text color="primary" @click="createNewAttachment">
										Vytvořit
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-card-text>
					</v-card>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script lang="ts">
import {
	Contract,
	ContractPhase,
	ContractPhaseInsertable,
	Customer,
	Phase,
	PhaseInsertable
} from '@bokari/api-client';
import { Currency } from '@bokari/entities';
import {
	computed,
	defineComponent,
	reactive,
	ref,
	toRefs,
	watchEffect
} from '@vue/composition-api';
import { asyncComputed, useTitle } from '@vueuse/core';

import DatePicker from '../components/DatePicker.vue';
import {
	contractAttachmentsAPIClient,
	contractPhasesAPIClient,
	contractsAPIClient,
	customersAPIClient,
	filesAPIClient,
	phaseAPIClient
} from '../http/api';
import { useTypedI18n } from '../plugins/i18n';
import { VDataTableHeader, VFormElement } from '../plugins/vuetify';
import { useRouter } from '../router';
import { useToastStore } from '../stores/toast.store';
import { useValidation } from '../utils/validations';

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
		const title = useTitle('Zakázka');
		const router = useRouter();
		const { showToast } = useToastStore();
		const i18n = useTypedI18n();

		const { contractCode } = toRefs(props);

		const phaseForm = ref<VFormElement | null>(null);
		const contractPhaseForm = ref<VFormElement | null>(null);
		const { validate: validatePhaseForm } = useValidation(phaseForm);
		const { isRequired, hasNonDefaultId, validate: validateContractPhaseForm } = useValidation(
			contractPhaseForm
		);

		const loading = ref(true);
		const contract = asyncComputed<Contract | null>(
			async () => {
				try {
					return contractsAPIClient.getContractByCode(contractCode.value).then(res => res.data);
				} catch {
					await router.push('/404');
					return null;
				}
			},
			null,
			loading
		);

		watchEffect(() => {
			if (contract.value) {
				title.value = `${contract.value.code} - ${contract.value.name}`;
			}
		});

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
				text: 'Uzávěrka',
				value: 'deadlineAt'
			},
			{
				text: 'Dokončena',
				value: 'isDone'
			},
			{
				text: 'Možnosti',
				value: 'actions'
			}
		];
		const savingContractPhases = ref(false);
		const saveContractPhases = async () => {
			savingContractPhases.value = true;
			const contractsToSave: ContractPhaseInsertable[] =
				contract.value?.contractPhases.map(cp => ({
					phaseId: cp.phase.id,
					deadlineAt: cp.deadlineAt,
					isDone: cp.isDone
				})) || [];
			return contractPhasesAPIClient
				.editContractPhases(contractCode.value, contractsToSave || [])
				.catch(() => {
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
				cp => cp.phase.id !== newContractPhase.value.phase.id
			);
			contract.value.contractPhases.push(newContractPhase.value);

			await saveContractPhases();
			newContractPhaseDialogVisible.value = false;
		};
		const deleteContractPhase = async (contractPhase: ContractPhase) => {
			if (!contract.value?.contractPhases) {
				return;
			}
			contract.value.contractPhases = contract.value.contractPhases.filter(
				cp => cp.phase.id !== contractPhase.phase.id
			);

			await saveContractPhases();
		};
		const openEditContractPhaseDialog = async (contractPhase?: ContractPhase) => {
			if (!contractPhase) {
				newContractPhase.value = {
					phase: {
						id: 0,
						name: ''
					},
					isDone: false,
					deadlineAt: ''
				};
			} else {
				newContractPhase.value = {
					phase: { ...contractPhase.phase },
					isDone: contractPhase.isDone,
					deadlineAt: contractPhase.deadlineAt.substr(0, 10)
				};
			}
			newContractPhaseDialogVisible.value = true;
		};

		const loadingCustomers = ref(true);
		const customers = asyncComputed<Customer[]>(
			() => customersAPIClient.getAllCustomers().then(res => res.data),
			[],
			loadingCustomers
		);

		const currencies = Object.values(Currency);

		const loadingPhases = ref(true);
		const phases = asyncComputed<Phase[]>(
			() => phaseAPIClient.getAllPhases().then(res => res.data),
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
				.then(res => {
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
				.then(() => {
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
				.then(() => {
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

		const newAttachment = reactive({
			file: null,
			note: ''
		});
		const creatingNewAttachment = ref(false);
		const createNewAttachment = async () => {
			try {
				creatingNewAttachment.value = true;
				const createdFile = await filesAPIClient
					.uploadFile(newAttachment.file)
					.then(res => res.data);
				const createdAttachment = await contractAttachmentsAPIClient
					.createContractAttachment(contractCode.value, {
						file: { id: createdFile.id },
						note: newAttachment.note
					})
					.then(res => res.data);
				contract.value?.attachments.push(createdAttachment);

				newAttachment.file = null;
				newAttachment.note = '';

				showToast({ message: 'Přílohu se nepodařilo vytvořit', type: 'success' });
			} catch {
				showToast({ message: 'Přílohu se nepodařilo vytvořit', type: 'error' });
			} finally {
				creatingNewAttachment.value = false;
			}
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
			contractPhaseForm,
			contractPhasesHeaders,
			createNewAttachment,
			createNewContractPhase,
			createNewPhase,
			creatingNewAttachment,
			creatingNewPhase,
			currencies,
			customers,
			datesEditable,
			deadlineAt,
			deleteContractPhase,
			detailsEditable,
			formattedPrice,
			hasNonDefaultId,
			isRequired,
			loading,
			loadingCustomers,
			loadingPhases,
			newAttachment,
			newContractPhase,
			newContractPhaseDialogVisible,
			newPhase,
			newPhaseDialogVisible,
			openEditContractPhaseDialog,
			phaseForm,
			phases,
			reloadContract,
			saveContract,
			saveContractPhases,
			savingContract,
			savingContractPhases,
			startAt,
			toggleDatesEditable,
			toggleDetailsEditable,
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
