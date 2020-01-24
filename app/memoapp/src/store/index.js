import Vue from "vue";
import Vuex from "vuex";
import isMobile from "ismobilejs";
// import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    login: {
      status: false,
      loginToken: "",
      userId: "",
      id: ""
    },
    isMobile: false,
    drawer: false
  },
  getters: {
    getLogin(state) {
      return state.login;
    },
    getLoginStatus(state) {
      return state.login.status;
    },
    getId(state) {
      return state.login.id;
    },
    getIsMobile(state) {
      return state.isMobile;
    },
    getDrawer(state) {
      return state.drawer;
    }
  },
  mutations: {
    updateStatus(state, data) {
      state.login = data;
    },
    isMobile(state) {
      state.isMobile = isMobile().any;
    },
    drawer(state) {
      state.drawer = !state.drawer;
    }
  },
  actions: {
    updateLoginStatus({ commit }, data) {
      commit("updateStatus", data);
    },
    judgeMobile({ commit }) {
      commit("isMobile");
    },
    toggleDrawer({ commit }) {
      commit("drawer");
    }
  },
  modules: {}
});
