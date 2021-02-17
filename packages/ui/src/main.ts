import Vue from 'vue';
import { router } from './router';
import vuetify from './plugins/vuetify';
import VueCompositionAPI from '@vue/composition-api';

import App from './App.vue';

import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';

Vue.config.productionTip = false;
Vue.use(VueCompositionAPI);

new Vue({
	router,
	vuetify,
	render: (h) => h(App)
}).$mount('#app');
