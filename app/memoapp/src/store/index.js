import Vue from "vue";
import Vuex from "vuex";
import isMobile from "ismobilejs";
import createPersistedState from "vuex-persistedstate";

// import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    login: {
      status: false,
      loginToken: "",
      userId: "",
      email: "",
      loginType: "",
      snipCounts: "",
      imgUrl: ""
    },
    isMobile: false,
    drawer: false,
    url: process.env.VUE_APP_BASE_URL,
    loading: true
  },
  getters: {
    getLogin(state) {
      return state.login;
    },
    getLoginStatus(state) {
      return state.login.status;
    },
    getUserId(state) {
      return state.login.userId;
    },
    getIsMobile(state) {
      return state.isMobile;
    },
    getDrawer(state) {
      return state.drawer;
    },
    getApiUrl(state) {
      return state.url;
    },
    getImgUrl(state) {
      return state.login.imgUrl;
    },
    getLoadingStatus(state) {
      return state.loading;
    }
  },
  mutations: {
    updateStatus(state, data) {
      state.login = data;
    },
    deleteStatus(state) {
      state.login = {
        status: false,
        loginToken: "",
        userId: "",
        email: "",
        loginType: "",
        snipCounts: ""
      };
    },
    incrementsSnip(state) {
      state.login.snipCounts += 1;
    },
    isMobile(state) {
      state.isMobile = isMobile().any;
    },
    drawer(state) {
      state.drawer = !state.drawer;
    },
    closeDrawer(state) {
      state.drawer = false;
    },
    changeLoading(state, boolean) {
      state.loading = boolean;
    }
  },
  actions: {
    updateLoginStatus({ commit }, data) {
      commit("updateStatus", data);
    },
    deleteLoginStatus({ commit }) {
      commit("deleteStatus");
    },
    incrementsSnipCounts({ commit }) {
      commit("incrementsSnip");
    },
    judgeMobile({ commit }) {
      commit("isMobile");
    },
    toggleDrawer({ commit }) {
      commit("drawer");
    },
    closeDrawer({ commit }) {
      commit("closeDrawer");
    },
    changeLoading({ commit }, boolean) {
      commit("changeLoading", boolean);
    }
  },
  modules: {},
  plugins: [
    createPersistedState({
      key: "Snippy"
    })
  ]
});
