import { Ref } from '@vue/composition-api';
import { VFormElement } from '@/plugins/vuetify';
import { InputValidationRule } from 'vuetify';
import isPostalCodeAccordingToValidatorJS from 'validator/es/lib/isPostalCode';
import isEmailAccordingToValidatorJS from 'validator/es/lib/isEmail';

export function useValidation(formRef: Ref<VFormElement | null>) {
	const isPattern = (pattern: RegExp): InputValidationRule => {
		return (input: string) =>
			!input || pattern.test(input) || 'Vstup neodpovídá požadovanému formátu RR{n}{n}{n}';
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

	const hasNonDefaultId: InputValidationRule = (input: any) =>
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
		hasNonDefaultId,
		validate,
		resetValidation,
		reset
	};
}
