import { WritableComputedRef } from '@vue/composition-api';
import VueI18n from 'vue-i18n';
import { Composer, createI18n, useI18n } from 'vue-i18n-composable';

import { csLocale, enLocale } from '../locales';
import { TypedLocale, TypedLocaleMessagePath } from '../locales/types';

interface TypedVueI18n extends VueI18n {
	t(key: TypedLocaleMessagePath, values?: VueI18n.Values): VueI18n.TranslateResult;

	t(
		key: TypedLocaleMessagePath,
		locale: TypedLocale,
		values?: VueI18n.Values
	): VueI18n.TranslateResult;

	tc(key: TypedLocaleMessagePath, choice?: VueI18n.Choice, values?: VueI18n.Values): string;

	tc(
		key: TypedLocaleMessagePath,
		choice: VueI18n.Choice,
		locale: TypedLocale,
		values?: VueI18n.Values
	): string;

	te(key: TypedLocaleMessagePath, locale?: TypedLocale): boolean;

	d(
		value: number | string | Date,
		key?: TypedLocaleMessagePath,
		locale?: TypedLocale
	): VueI18n.DateTimeFormatResult;

	d(value: number | string | Date, args?: { [key: string]: string }): VueI18n.DateTimeFormatResult;

	d(
		value: number | string | Date,
		options?: VueI18n.DateTimeFormatOptions
	): VueI18n.DateTimeFormatResult;

	n(value: number, key?: TypedLocaleMessagePath, locale?: TypedLocale): VueI18n.NumberFormatResult;

	n(value: number, args?: { [key: string]: string }): VueI18n.NumberFormatResult;

	n(value: number, options?: VueI18n.NumberFormatOptions): VueI18n.NumberFormatResult;
}

export interface TypedComposer extends Composer {
	locale: WritableComputedRef<TypedLocale>;
	t: TypedVueI18n['t'];
	tc: TypedVueI18n['tc'];
	te: TypedVueI18n['te'];
	d: TypedVueI18n['d'];
	n: TypedVueI18n['n'];
}

export function useTypedI18n(): TypedComposer {
	const i18n = useI18n();

	i18n.d = new Proxy(i18n.d, {
		apply(target, thisArg, args) {
			const [value, ...restOfArgs] = args;
			if (typeof value === 'string') {
				return target(new Date(value), ...restOfArgs);
			}
			return target(value, restOfArgs);
		}
	});

	return i18n as TypedComposer;
}

export const i18n = createI18n({
	locale: navigator.language.replace(/[-_][a-z]+/gi, ''),
	fallbackLocale: 'en',
	numberFormats: {
		cs: {
			currency: csLocale.currency
		},
		en: {
			currency: enLocale.currency
		}
	},
	messages: {
		cs: csLocale.messages,
		en: enLocale.messages
	}
});
