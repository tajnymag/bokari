import VueCompositionAPI, { createApp } from '@vue/composition-api';
import PortalVue from 'portal-vue';
import Vue, { CreateElement } from 'vue';

import App from './App.vue';
import { i18n } from './plugins/i18n';
import vuetify from './plugins/vuetify';
import { router } from './router';

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
