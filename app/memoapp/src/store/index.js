import Vue from "vue";
import Vuex from "vuex";
// import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    login: {
      status: false,
      loginToken: "",
      userId: ""
    }
  },
  getters: {
    getLoginStatus(state) {
      return state.login;
    }
  },
  mutations: {
    updateStatus(state, data) {
      state.login = data;
    }
  },
  actions: {
    async updateLoginStatus({ commit }, data) {
      commit("updateStatus", data);
    }
  },
  modules: {}
});
