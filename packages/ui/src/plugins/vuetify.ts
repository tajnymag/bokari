import Vue from 'vue';
// @ts-expect-error
import Vuetify from 'vuetify/lib/framework';
import cs from 'vuetify/src/locale/cs';

Vue.use(Vuetify);

export default new Vuetify({
	theme: {
		options: {
			customProperties: true
		},
		themes: {
			light: {
				primary: '#ee44aa',
				secondary: '#424242',
				accent: '#82B1FF',
				error: '#FF5252',
				info: '#2196F3',
				success: '#4CAF50',
				warning: '#FFC107'
			}
		}
	},
	lang: {
		locales: { cs },
		current: 'cs'
	}
});
