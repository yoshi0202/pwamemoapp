<template>
  <v-app>
    <Header />
    <v-content class="grey lighten-3">
      <router-view />
    </v-content>
    <NavigationDrawer />
  </v-app>
</template>

<script>
import Header from "./components/Header";
import NavigationDrawer from "./components/NavigationDrawer";

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
  methods: {}
};
</script>
