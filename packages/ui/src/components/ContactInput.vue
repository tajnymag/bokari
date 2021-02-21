<template>
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
			</v-col>
			<v-col>
				<v-switch v-model="hasAddress" label="Přidat adresu" />

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
</template>

<script lang="ts">
import { ContactInsertable } from '@bokari/api-client';
import { defineComponent, ref } from '@vue/composition-api';
import { debouncedWatch } from '@vueuse/core';

import { VFormElement } from '../plugins/vuetify';
import { useValidation } from '../utils/validations';

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
	name: 'ContactInput',
	props: {
		value: {
			type: Object as () => ContactInsertable,
			default: () => DefaultContactValue
		}
	},
	setup(props, { emit }) {
		const contactForm = ref<VFormElement | null>(null);
		const addressForm = ref<VFormElement | null>(null);
		const contact = ref<ContactInsertable>(props.value || DefaultContactValue);
		const hasAddress = ref(false);

		const { isPostalCode, isRequired, isEmail, validate: validateContact } = useValidation(
			contactForm
		);
		const { validate: validateAddress } = useValidation(addressForm);

		debouncedWatch(
			contact.value,
			() => {
				if (validateContact() && (validateAddress() || !hasAddress.value)) {
					const contactToPublish: ContactInsertable = {
						...contact.value,
						...{ address: hasAddress.value ? contact.value.address : undefined }
					};

					emit('input', contactToPublish);
				}
			},
			{ debounce: 500 }
		);

		return {
			contactForm,
			addressForm,
			contact,
			hasAddress,
			isRequired,
			isEmail,
			isPostalCode
		};
	}
});
</script>

<style scoped></style>
