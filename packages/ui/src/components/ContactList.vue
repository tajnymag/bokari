<template>
	<v-list>
		<v-row>
			<v-spacer />
			<v-btn outlined @click="createContact">Přidat kontakt</v-btn>
		</v-row>

		<v-list-item v-for="(contact, index) in contacts" :key="index">
			<v-list-item-content>
				<v-form ref="contactForm">
					<v-row>
						<v-col>
							<v-text-field
								v-model="contact.email"
								:rules="[isEmail]"
								label="E-mail"
								type="email"
							/>
							<v-text-field v-model="contact.phone" label="Telefon" type="tel" />
							<v-textarea v-model="contact.note" label="Poznámka" />
							<v-switch v-model="hasAddress" label="Přidat adresu" />
						</v-col>
						<v-col>
							<v-form v-if="hasAddress" ref="addressForm">
								<v-text-field
									v-model="contact.address.city"
									:rules="[isRequired]"
									label="Město"
								/>
								<v-text-field
									v-model="contact.address.street"
									:rules="[isRequired]"
									label="Ulice a číslo popisné"
								/>
								<v-text-field
									v-model="contact.address.zip"
									:rules="[isPostalCode]"
									label="PSČ"
								/>
								<v-text-field v-model="contact.address.state" label="Kraj" />
								<v-text-field
									v-model="contact.address.country"
									:rules="[isRequired]"
									label="Země"
								/>
							</v-form>
						</v-col>
					</v-row>
				</v-form>
			</v-list-item-content>
			<v-list-item-action>
				<v-btn icon @click="deleteContact(index)">
					<v-icon>mdi-delete</v-icon>
				</v-btn>
			</v-list-item-action>
		</v-list-item>

		<v-row v-if="contacts.length > 0">
			<v-spacer />
			<v-btn text>Potvrdit kontakty</v-btn>
		</v-row>
	</v-list>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from '@vue/composition-api';
import { ContactInsertable } from '@bokari/api-client';
import ContactInput from '@/components/ContactInput.vue';
import { VFormElement } from '@/plugins/vuetify';
import { useValidation } from '@/utils/validations';

const DefaultContactValue: ContactInsertable = {
	email: '',
	phone: '',
	note: '',
	address: {
		city: '',
		street: '',
		zip: '',
		state: '',
		country: ''
	}
};

export default defineComponent({
	name: 'ContactList',
	components: {
		ContactInput
	},
	props: {
		value: {
			type: Array as () => ContactInsertable[],
			default: () => []
		}
	},
	setup(props, { emit }) {
		const contacts = ref<ContactInsertable[]>([]);
		const contactForm = ref<VFormElement | null>(null);
		const addressForm = ref<VFormElement | null>(null);
		const hasAddress = ref(false);

		const { isPostalCode, isRequired, isEmail, validate: validateContact } = useValidation(
			contactForm
		);
		const { validate: validateAddress } = useValidation(addressForm);

		const deleteContact = (index: number) => {
			contacts.value = contacts.value.filter((contract, i) => i !== index);
		};

		const createContact = () => {
			contacts.value.push(DefaultContactValue);
		};

		watchEffect(() => {
			emit('input', contacts.value);
		});

		return {
			contacts,
			deleteContact,
			createContact,
			isRequired,
			isEmail,
			isPostalCode,
			hasAddress
		};
	}
});
</script>

<style scoped></style>
