<template>
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
			</v-col>
			<v-col>
				<v-switch label="Přidat adresu" v-model="hasAddress" />

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
</template>

<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import { debouncedWatch } from '@vueuse/core';
import { VFormElement } from '@/plugins/vuetify';
import { ContactInsertable } from '@bokari/api-client';
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
