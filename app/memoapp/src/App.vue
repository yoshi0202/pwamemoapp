<template>
  <v-app>
    <Header @logout="logout" />
    <!-- <v-content class="grey lighten-3 pa-0 ma-0"> -->
    <router-view />
    <!-- </v-content> -->
    <NavigationDrawer @logout="logout" v-if="$store.getters.getIsMobile" />
    <v-btn v-if="$route.path === '/'" color="purple lighten-2" right bottom fixed fab dark to="/addSnippets">
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
  created: async function() {
    this.$store.dispatch("judgeMobile");
    this.$store.dispatch("initializeErrorMsg");
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
      this.$store.dispatch("changeLoading", false);
      this.$router.push("/");
    }
  }
};
</script>
