import Vue, { CreateElement } from 'vue';
import VueCompositionAPI, { createApp } from '@vue/composition-api';
import PortalVue from 'portal-vue';

import vuetify from './plugins/vuetify';
import { i18n } from './plugins/i18n';
import { router } from './router';

import App from './App.vue';

import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.config.productionTip = false;
Vue.use(VueCompositionAPI);
Vue.use(PortalVue);

const app = createApp({
	router,
	vuetify,
	i18n,
	render: (h: CreateElement) => h(App)
});

app.mount('#app');
