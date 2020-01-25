<template>
  <v-app>
    <Header @logout="logout" />
    <v-content class="grey lighten-3">
      <router-view />
    </v-content>
    <NavigationDrawer @logout="logout" />
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
      await axios.delete("https://u65qbs6yva.execute-api.ap-northeast-1.amazonaws.com/prod/api/logout", {
        data: {
          userid: userInfo.userId,
          loginToken: userInfo.loginToken
        }
      });
      this.$store.dispatch("deleteLoginStatus");
      this.$router.push("/");
    }
  }
};
</script>
