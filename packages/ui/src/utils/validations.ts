import { Ref } from '@vue/composition-api';
import { isValidPhoneNumber } from 'libphonenumber-js';
import isEmailAccordingToValidatorJS from 'validator/es/lib/isEmail';
import isPostalCodeAccordingToValidatorJS from 'validator/es/lib/isPostalCode';
import { InputValidationRule } from 'vuetify';

import { VFormElement } from '../plugins/vuetify';

interface UnknownObjectWithId {
	id: number;

	[key: string]: unknown;
}

export function useValidation(formRef: Ref<VFormElement | null>) {
	const isPattern = (pattern: RegExp): InputValidationRule => {
		return (input: string) =>
			!input || pattern.test(input) || 'Vstup neodpovídá požadovanému formátu';
	};

	const isNumber: InputValidationRule = (input: string) =>
		!input || /^[0-9,. ]+$/.test(input) || 'Vstup není ve správném formátu čísla';

	const isRequired: InputValidationRule = (input: unknown) => !!input || 'Povinný vstup';

	const isPostalCode: InputValidationRule = (input: string) =>
		!input ||
		isPostalCodeAccordingToValidatorJS(input, 'any') ||
		'Není platné poštovní směrovací číslo';

	const isEmail: InputValidationRule = (input: string) =>
		!input || isEmailAccordingToValidatorJS(input) || 'Není platný email';

	const isPhoneNumber: InputValidationRule = (input: string) =>
		!input ||
		isValidPhoneNumber(input) ||
		'Není platné telefonní číslo. Číslo musí například obsahovat předvolbu';

	const isUsername: InputValidationRule = (input: string) =>
		!input ||
		/^[a-z0-9._-]+$/i.test(input) ||
		'Uživatelské jméno může obsahovat pouze alfanumerické znaky a znaky ".", "_", "-"';

	const isImage: InputValidationRule = (input: File) =>
		!input || /^image\//.test(input.type) || 'Soubor musí být typu obrázek';

	const hasSizeMax = (sizeInBytes: number): InputValidationRule => {
		return (input: File) =>
			!input ||
			input.size <= sizeInBytes ||
			`Soubor musí být menší než ${(sizeInBytes / 1000000).toFixed(1)} MB`;
	};

	const hasEntries: InputValidationRule = (input: unknown) =>
		!input ||
		(Array.isArray(input) && input.length > 0) ||
		'Seznam musí obsahovat alespoň jednu součást';

	const hasNonDefaultId: InputValidationRule = (input: UnknownObjectWithId) =>
		!input || input.id > 0 || 'Objekt nebyl zvolen';

	const validate = () => formRef.value?.validate();
	const reset = () => formRef.value?.reset();
	const resetValidation = () => formRef.value?.resetValidation();

	return {
		isPattern,
		isNumber,
		isRequired,
		isPostalCode,
		isEmail,
		isPhoneNumber,
		isUsername,
		isImage,
		hasSizeMax,
		hasEntries,
		hasNonDefaultId,
		validate,
		resetValidation,
		reset
	};
}
