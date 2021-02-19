import enLocaleMessages from '../locales/en';
import csLocaleMessages from '../locales/cs';
import { createI18n } from 'vue-i18n-composable';

export const i18n = createI18n({
	locale: navigator.language.replace(/[-_][a-z]+/gi, ''),
	fallbackLocale: 'en',
	numberFormats: {
		cs: {
			currency: {
				style: 'currency',
				currency: 'CZK',
				currencyDisplay: 'code'
			}
		},
		en: {
			currency: {
				style: 'currency',
				currency: 'USD',
				currencyDisplay: 'code'
			}
		}
	},
	messages: {
		cs: csLocaleMessages,
		en: enLocaleMessages
	}
});
