import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import mavonEditor from "mavon-editor";
import "mavon-editor/dist/css/index.css";
import InputTag from "vue-input-tag";
import PerfectScrollbar from "vue2-perfect-scrollbar";
import "vue2-perfect-scrollbar/dist/vue2-perfect-scrollbar.css";
import VueCarousel from "vue-carousel";

Vue.config.productionTip = false;

Vue.component("input-tag", InputTag);

Vue.use(mavonEditor);
Vue.use(PerfectScrollbar);
Vue.use(VueCarousel);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount("#app");
