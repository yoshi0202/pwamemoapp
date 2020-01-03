import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import InputTag from "vue-input-tag";

Vue.config.productionTip = false;

Vue.component("input-tag", InputTag);

Vue.use(mavonEditor);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
