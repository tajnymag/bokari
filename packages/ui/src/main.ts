import Vue from "vue";

import App from "./App.vue";

import router from "./router";
import store from "./store";

import vuetify from "./plugins/vuetify";
import i18n from "./plugins/i18n";

import "roboto-fontface/css/roboto/roboto-fontface.css";
import "material-design-icons-iconfont/dist/material-design-icons.css";

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: h => h(App)
}).$mount("#app");
