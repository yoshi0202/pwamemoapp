<template>
  <v-app>
    <Header @logout="logout" v-if="!$store.getters.getIsMobile" />
    <MobileHeader v-else @logout="logout" />
    <router-view />
    <NavigationDrawer @logout="logout" v-if="$store.getters.getIsMobile" />
    <!-- <v-btn v-if="$route.name === 'home'" color="purple lighten-2" right bottom fixed fab dark to="/addSnippets">
      <v-icon dark>mdi-code-tags</v-icon>
    </v-btn> -->
    <v-speed-dial
      v-if="$route.name === 'home'"
      color="purple lighten-2"
      right
      bottom
      fixed
      fab
      dark
      transition="scale-transition"
    >
      <template v-slot:activator>
        <v-btn color="purple lighten-2" dark fab>
          <v-icon>mdi-code-tags</v-icon>
        </v-btn>
      </template>
      <v-btn fab dark small color="green" to="/addSnippets">
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on">mdi-plus</v-icon>
          </template>
          <span>スニペットを追加する</span>
        </v-tooltip>
      </v-btn>
      <v-btn fab dark small color="red" to="/addSnippets?mode=memo">
        <v-tooltip left>
          <template v-slot:activator="{ on }">
            <v-icon v-on="on">mdi-note</v-icon>
          </template>
          <span>メモを追加する</span>
        </v-tooltip>
      </v-btn>
    </v-speed-dial>
    <v-container
      style="padding-top:200px"
      grey
      lighten-3
      fluid
      v-if="$route.name !== 'addSnippets' && $route.name !== 'editCard'"
    >
      <Footer />
    </v-container>
  </v-app>
</template>

<script>
import Header from "./components/Header";
import MobileHeader from "./components/MobileHeader";
import NavigationDrawer from "./components/NavigationDrawer";
import Footer from "./components/Footer";
import axios from "axios";

export default {
  name: "App",

  components: {
    Header,
    MobileHeader,
    NavigationDrawer,
    Footer
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
<style>
.v-application code {
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
}
</style>
