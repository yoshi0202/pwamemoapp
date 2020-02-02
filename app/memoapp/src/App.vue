<template>
  <v-app>
    <Header @logout="logout" />
    <v-content class="grey lighten-3">
      <router-view />
    </v-content>
    <NavigationDrawer @logout="logout" />
    <v-btn v-if="$route.path === '/'" color="#FDB436" right bottom fixed fab dark to="/addCard">
      <v-icon dark>mdi-code-tags</v-icon>
    </v-btn>
  </v-app>
</template>

<script>
import Header from "./components/Header";
import NavigationDrawer from "./components/NavigationDrawer";
import axios from "axios";

export default {
  name: "App",

  components: {
    Header,
    NavigationDrawer
  },

  data: () => ({}),
  created: function() {
    this.$store.dispatch("judgeMobile");
  },
  methods: {
    logout: async function() {
      const userInfo = this.$store.getters.getLogin;
      const apiUrl = this.$store.getters.getApiUrl;
      await axios.delete(apiUrl + "auth/logout", {
        data: {
          userId: userInfo.userId,
          loginToken: userInfo.loginToken
        }
      });
      this.$store.dispatch("deleteLoginStatus");
      this.$router.push("/");
    }
  }
};
</script>
