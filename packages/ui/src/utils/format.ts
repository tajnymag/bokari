import { parsePhoneNumberFromString } from 'libphonenumber-js';

export function useFormat() {
	const formatPhoneNumber = (input: string) =>
		parsePhoneNumberFromString(input)?.formatInternational() ||
		`${input} (formátování se nezdařilo)`;

	return {
		formatPhoneNumber
	};
}
