<template>
	<v-card>
		<v-toolbar>
			<v-card-title>Kontakty</v-card-title>
			<v-spacer />
			<v-btn icon @click.stop="openEditContactDialog()">
				<v-icon>mdi-plus</v-icon>
			</v-btn>
		</v-toolbar>

		<v-card-text>
			<v-data-iterator :items="contacts" hide-default-footer>
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
													{{ formatPhoneNumber(contact.phone) }}
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
									<v-btn text @click.stop="openEditContactDialog(contact)">
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
						<v-text-field v-model="editableContact.note" label="Poznámka" />

						<v-switch v-model="editableContactHasAddress" label="Adresa" />

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
</template>

<script lang="ts">
import { Contact } from '@bokari/api-client';
import { defineComponent, ref, toRefs, watchEffect } from '@vue/composition-api';
import { syncRef } from '@vueuse/core';
import { cloneDeep, isEqual } from 'lodash-es';

import { peopleAPIClient } from '../http/api';
import { VFormElement } from '../plugins/vuetify';
import { useToastStore } from '../stores/toast.store';
import { useFormat } from '../utils/format';
import { useValidation } from '../utils/validations';

const DefaultContactValue: Contact = {
	id: 0,
	email: '',
	phone: '',
	note: '',
	address: {
		id: 0,
		city: '',
		street: '',
		zip: '',
		state: '',
		country: ''
	}
};

export default defineComponent({
	name: 'ContactInput',
	props: {
		value: {
			type: Array as () => Contact[],
			default: () => []
		},
		personId: {
			type: Number,
			required: true
		}
	},
	setup(props, { emit }) {
		const { value: inputProp, personId } = toRefs(props);
		const contactForm = ref<VFormElement | null>(null);
		const contactDialogOpen = ref(false);
		const contacts = ref<Contact[]>(inputProp.value);
		syncRef(inputProp, contacts);

		const { showToast } = useToastStore();
		const { formatPhoneNumber } = useFormat();
		const {
			isRequired,
			isPhoneNumber,
			isEmail,
			isPostalCode,
			validate: validateContactForm
		} = useValidation(contactForm);

		const editableContact = ref<Contact>(DefaultContactValue);
		const editableContactHasAddress = ref(false);
		const updateContact = async (contact: Contact) => {
			try {
				await peopleAPIClient.editContact(personId.value, contact.id, contact);
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
		};
		const createContact = async (contact: Contact) => {
			try {
				const createdContact = await peopleAPIClient
					.createContact(personId.value, contact)
					.then(res => res.data);
				showToast({
					message: 'Kontakt byl úspěšně vytvořen.',
					type: 'success'
				});
				contacts.value.push(createdContact);
			} catch {
				showToast({
					message: 'Nepodařilo se vytvořit daný kontakt.',
					type: 'error'
				});
			}
		};
		const openEditContactDialog = (contactToEdit = cloneDeep(DefaultContactValue)) => {
			contactDialogOpen.value = true;
			editableContact.value = contactToEdit;
			editableContactHasAddress.value = !!contactToEdit.address;

			if (!editableContact.value.address) {
				editableContact.value.address = cloneDeep(DefaultContactValue.address);
			}
		};
		const handleContactUpsertButton = async () => {
			if (!validateContactForm()) {
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
				await peopleAPIClient.deleteContact(personId.value || 0, contact.id);

				contacts.value = contacts.value.filter(c => c.id !== contact.id);

				showToast({ message: 'Kontakt byl úspěšně odebrán.', type: 'success' });
			} catch {
				showToast({ message: 'Kontakt se nepodařilo odebrat.', type: 'error' });
			} finally {
				contactDialogOpen.value = false;
			}
		};

		watchEffect(() => {
			if (!isEqual(inputProp.value, contacts.value)) {
				emit('input', contacts.value);
			}
		});

		return {
			contacts,
			editableContact,
			editableContactHasAddress,
			contactForm,
			contactDialogOpen,
			formatPhoneNumber,
			isRequired,
			isPostalCode,
			isEmail,
			isPhoneNumber,
			openEditContactDialog,
			handleContactDeleteButton,
			handleContactUpsertButton
		};
	}
});
</script>

<style scoped></style>
