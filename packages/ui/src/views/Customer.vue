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
					<v-card>
						<v-toolbar>
							<v-card-title>Kontakty</v-card-title>
							<v-spacer />
							<v-btn icon @click.stop="openEditContactDialog()">
								<v-icon>mdi-plus</v-icon>
							</v-btn>
						</v-toolbar>

						<v-card-text>
							<v-data-iterator :items="customer.person.contacts" hide-default-footer>
								<template v-slot:default="{ items }">
									<v-row>
										<v-col v-for="contact in items" :key="contact.id">
											<v-card>
												<v-card-text>
													<v-list>
														<v-list-item v-if="contact.phone">
															<v-list-item-icon>
																<v-icon>
																	mdi-phone
																</v-icon>
															</v-list-item-icon>
															<v-list-item-content>
																<v-list-item-title>
																	{{
																		formatPhoneNumber(
																			contact.phone
																		)
																	}}
																</v-list-item-title>
																<v-list-item-subtitle>
																	Telefon
																</v-list-item-subtitle>
															</v-list-item-content>
														</v-list-item>

														<template v-if="contact.email">
															<v-divider inset />
															<v-list-item>
																<v-list-item-icon>
																	<v-icon>
																		mdi-email
																	</v-icon>
																</v-list-item-icon>
																<v-list-item-content>
																	<v-list-item-title>
																		{{ contact.email }}
																	</v-list-item-title>
																	<v-list-item-subtitle>
																		E-mail
																	</v-list-item-subtitle>
																</v-list-item-content>
															</v-list-item>
														</template>

														<template v-if="contact.note">
															<v-divider inset />
															<v-list-item>
																<v-list-item-icon>
																	<v-icon>
																		mdi-clipboard-text
																	</v-icon>
																</v-list-item-icon>
																<v-list-item-content>
																	<v-list-item-title>
																		{{ contact.note }}
																	</v-list-item-title>
																	<v-list-item-subtitle>
																		Poznámka
																	</v-list-item-subtitle>
																</v-list-item-content>
															</v-list-item>
														</template>

														<template v-if="contact.address">
															<v-divider inset />
															<v-list-item>
																<v-list-item-icon>
																	<v-icon>
																		mdi-map-marker
																	</v-icon>
																</v-list-item-icon>

																<v-list-item-content>
																	<v-list-item-title>
																		{{ contact.address.street }}
																	</v-list-item-title>
																	<v-list-item-subtitle>
																		{{ contact.address.city }},
																		{{ contact.address.zip }}
																	</v-list-item-subtitle>
																</v-list-item-content>
															</v-list-item>
														</template>
													</v-list>
												</v-card-text>
												<v-card-actions>
													<v-btn
														text
														color="danger"
														@click="handleContactDeleteButton(contact)"
													>
														Smazat
													</v-btn>
													<v-spacer />
													<v-btn
														text
														@click.stop="openEditContactDialog(contact)"
													>
														Upravit
													</v-btn>
												</v-card-actions>
											</v-card>
										</v-col>
									</v-row>
								</template>
							</v-data-iterator>
						</v-card-text>

						<v-dialog v-model="contactDialogOpen" max-width="500">
							<v-card>
								<v-card-title>Upravit nebo vytvořit kontakt</v-card-title>

								<v-card-text>
									<v-form ref="contactForm">
										<v-text-field
											v-model="editableContact.email"
											:rules="[isEmail]"
											type="email"
											label="E-mail"
										/>
										<v-text-field
											v-model="editableContact.phone"
											:rules="[isPhoneNumber]"
											type="tel"
											label="Telefon"
										/>
										<v-text-field
											v-model="editableContact.note"
											label="Poznámka"
										/>

										<v-switch
											v-model="editableContactHasAddress"
											label="Adresa"
										/>

										<template v-if="editableContactHasAddress">
											<v-divider />
											<v-text-field
												v-model="editableContact.address.street"
												:rules="[isRequired]"
												label="Ulice"
											/>
											<v-text-field
												v-model="editableContact.address.zip"
												:rules="[isPostalCode, isRequired]"
												label="PSČ"
											/>
											<v-text-field
												v-model="editableContact.address.city"
												:rules="[isRequired]"
												label="Obec"
											/>
											<v-text-field
												v-model="editableContact.address.country"
												:rules="[isRequired]"
												label="Země"
											/>
											<v-text-field
												v-model="editableContact.address.state"
												label="Kraj/Stát"
											/>
										</template>
									</v-form>
								</v-card-text>

								<v-card-actions>
									<v-spacer />
									<v-btn text color="primary" @click="handleContactUpsertButton">
										Uložit
									</v-btn>
								</v-card-actions>
							</v-card>
						</v-dialog>
					</v-card>
				</v-col>

				<v-col cols="12">
					<v-card>
						<v-toolbar>
							<v-card-title>Zakázky</v-card-title>
						</v-toolbar>
					</v-card>
				</v-col>
			</v-row>
		</v-card-text>
	</v-card>
</template>

<script lang="ts">
import { Contact, Customer } from '@bokari/api-client';
import { defineComponent, ref, watchEffect } from '@vue/composition-api';
import { asyncComputed, useTitle } from '@vueuse/core';
import { cloneDeep } from 'lodash-es';

import { customersAPIClient, peopleAPIClient } from '../http/api';
import { VFormElement } from '../plugins/vuetify';
import { useToastStore } from '../stores/toast.store';
import { useFormat } from '../utils/format';
import { useValidation } from '../utils/validations';

export default defineComponent({
	name: 'Customer',
	props: {
		customerId: {
			type: Number,
			required: true
		}
	},
	setup(props) {
		const title = useTitle('Klient');
		const { showToast } = useToastStore();
		const { formatPhoneNumber } = useFormat();

		const contactDialogOpen = ref(false);
		const contactForm = ref<VFormElement | null>(null);
		const {
			isPhoneNumber,
			isEmail,
			isRequired,
			isPostalCode,
			validate: validateContact
		} = useValidation(contactForm);

		const loading = ref(false);
		const customer = asyncComputed<Customer | null>(
			() =>
				customersAPIClient
					.getCustomerById(props.customerId)
					.then(res => res.data)
					.catch(() => null),
			null,
			loading
		);

		const detailsEditable = ref(false);
		const toggleDetailsEditable = async () => {
			detailsEditable.value = !detailsEditable.value;

			if (!detailsEditable.value && customer.value?.person) {
				try {
					await peopleAPIClient.editPerson(
						customer.value.person.id,
						customer.value.person
					);
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

		const defaultContact: Contact = {
			id: 0,
			email: '',
			phone: '',
			note: '',
			address: {
				id: 0,
				city: '',
				country: '',
				state: '',
				street: '',
				zip: ''
			}
		};
		const editableContact = ref<Contact>(defaultContact);
		const editableContactHasAddress = ref(false);
		const updateContact = async (contact: Contact) => {
			if (customer.value?.person) {
				try {
					await peopleAPIClient.editContact(
						customer.value.person.id,
						contact.id,
						contact
					);
					showToast({
						message: 'Kontakt byl úspěšně aktualizován.',
						type: 'success'
					});
				} catch {
					showToast({
						message: 'Nepodařilo se aktualizovat daný kontakt.',
						type: 'error'
					});
				}
			}
		};
		const createContact = async (contact: Contact) => {
			if (customer.value?.person) {
				try {
					const createdContact = await peopleAPIClient
						.createContact(customer.value.person.id, contact)
						.then(res => res.data);
					showToast({
						message: 'Kontakt byl úspěšně vytvořen.',
						type: 'success'
					});
					customer.value?.person.contacts.push(createdContact);
				} catch {
					showToast({
						message: 'Nepodařilo se vytvořit daný kontakt.',
						type: 'error'
					});
				}
			}
		};
		const openEditContactDialog = (contactToEdit = cloneDeep(defaultContact)) => {
			contactDialogOpen.value = true;
			editableContact.value = contactToEdit;
			editableContactHasAddress.value = !!contactToEdit.address;

			if (!editableContact.value.address) {
				editableContact.value.address = cloneDeep(defaultContact.address);
			}
		};
		const handleContactUpsertButton = async () => {
			if (!validateContact()) {
				showToast({ message: 'Zkontrolujte platnost zadaných údajů.', type: 'error' });
				return;
			}

			if (!editableContactHasAddress.value) {
				editableContact.value.address = undefined;
			}

			if (editableContact.value.id > 0) {
				await updateContact(editableContact.value);
			} else {
				await createContact(editableContact.value);
			}
			contactDialogOpen.value = false;
		};
		const handleContactDeleteButton = async (contact: Contact) => {
			try {
				await peopleAPIClient.deleteContact(customer.value?.person.id || 0, contact.id);

				if (customer.value?.person.contacts) {
					customer.value.person.contacts = customer.value?.person.contacts.filter(
						c => c.id !== contact.id
					);
				}

				showToast({ message: 'Kontakt byl úspěšně odebrán.', type: 'success' });
			} catch {
				showToast({ message: 'Kontakt se nepodařilo odebrat.', type: 'error' });
			} finally {
				contactDialogOpen.value = false;
			}
		};

		watchEffect(() => {
			if (customer.value?.person) {
				title.value = customer.value.person.name;
			}
		});

		return {
			contactDialogOpen,
			contactForm,
			customer,
			detailsEditable,
			editableContact,
			editableContactHasAddress,
			formatPhoneNumber,
			handleContactUpsertButton,
			handleContactDeleteButton,
			isEmail,
			isPhoneNumber,
			isPostalCode,
			isRequired,
			loading,
			openEditContactDialog,
			toggleDetailsEditable
		};
	}
});
</script>

<style scoped></style>
