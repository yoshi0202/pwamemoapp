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
      snipCounts: ""
    },
    isMobile: false,
    drawer: false,
    url: process.env.VUE_APP_BASE_URL
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
    }
  },
  modules: {},
  plugins: [
    createPersistedState({
      key: "Snippy"
    })
  ]
});
