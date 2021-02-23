import Vue from 'vue';
// @ts-expect-error Vuetify doesn't work well in monorepos afaik
import Vuetify from 'vuetify/lib/framework';
import cs from 'vuetify/src/locale/cs';
import en from 'vuetify/src/locale/en';

Vue.use(Vuetify);

export interface VDialogElement extends HTMLElement {
	save: (value: unknown) => void;
}

export interface VFormElement extends HTMLElement {
	reset: () => void;
	resetValidation: () => void;
	validate: () => boolean;
}

export interface VDataTableHeader {
	text: string;
	value: string;
}

export default new Vuetify({
	theme: {
		options: {
			customProperties: true
		},
		themes: {
			light: {
				primary: '#795548',
				secondary: '#ff9800',
				accent: '#607d8b',
				error: '#f44336',
				info: '#2196f3',
				success: '#4caf50',
				warning: '#ffc107'
			}
		}
	},
	lang: {
		locales: { cs, en },
		current: 'cs'
	},
	icons: {
		iconfont: 'mdi'
	}
});
