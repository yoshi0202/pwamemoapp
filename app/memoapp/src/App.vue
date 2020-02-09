<template>
  <v-app>
    <Header @logout="logout" />
    <!-- <v-content class="grey lighten-3 pa-0 ma-0"> -->
    <router-view :menu="menu" />
    <!-- </v-content> -->
    <NavigationDrawer @logout="logout" :menu="menu" />
    <v-btn
      v-if="$route.path === '/'"
      color="purple lighten-2"
      right
      bottom
      fixed
      fab
      dark
      to="/addSnippets"
    >
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
  // watch: {
  //   async $route(to) {
  //     if (to.query.l) {
  //       this.$store.dispatch("changeLoading", true);
  //       const apiUrl = this.$store.getters.getApiUrl + "api/";
  //       const result = await axios.get(apiUrl + "snip/category?l=" + to.query.l);
  //       this.$store.dispatch("changeLoading", false);
  //       if (result.result !== "param error") {
  //         this.snipData = result.data.Items;
  //         this.userData = result.data.userData;
  //       }
  //     }
  //   }
  // },

  data: () => ({
    menu: []
  }),
  created: async function() {
    this.$store.dispatch("judgeMobile");
    const apiUrl = this.$store.getters.getApiUrl + "api/";
    const categoryUrl = apiUrl + "category/categories";
    const getCategories = await axios.get(categoryUrl);
    getCategories.data.Items.map(v => this.menu.push(v.category));
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
