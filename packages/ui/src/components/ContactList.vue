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
								label="E-mail"
								type="email"
								:rules="[isEmail]"
								v-model="contact.email"
							/>
							<v-text-field label="Telefon" type="tel" v-model="contact.phone" />
							<v-textarea label="Poznámka" v-model="contact.note" />
							<v-switch label="Přidat adresu" v-model="hasAddress" />
						</v-col>
						<v-col>
							<v-form ref="addressForm" v-if="hasAddress">
								<v-text-field
									label="Město"
									:rules="[isRequired]"
									v-model="contact.address.city"
								/>
								<v-text-field
									label="Ulice a číslo popisné"
									:rules="[isRequired]"
									v-model="contact.address.street"
								/>
								<v-text-field
									label="PSČ"
									:rules="[isPostalCode]"
									v-model="contact.address.zip"
								/>
								<v-text-field label="Kraj" v-model="contact.address.state" />
								<v-text-field
									label="Země"
									:rules="[isRequired]"
									v-model="contact.address.country"
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
