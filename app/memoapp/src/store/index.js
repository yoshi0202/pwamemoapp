import Vue from "vue";
import Vuex from "vuex";
import axios from "axios";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    login: {
      status: false
    }
  },
  getters: {
    getLoginStatus(state) {
      return state.login.status;
    }
  },
  mutations: {
    updateStatus(state, data) {
      state.login.status = data;
    }
  },
  actions: {
    async updateLoginStatus({ commit }, data) {
      const result = await axios.post("http://localhost:3000/api/login", {
        status: data
      });
      console.log(result.data.result);
      commit("updateStatus", result.data.result);
    }
  },
  modules: {}
});
