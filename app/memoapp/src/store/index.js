import Vue from "vue";
import Vuex from "vuex";
// import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    login: {
      status: false,
      loginToken: "",
      userId: "",
      id: ""
    }
  },
  getters: {
    getLoginStatus(state) {
      return state.login;
    },
    getId(state) {
      return state.login.id;
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
