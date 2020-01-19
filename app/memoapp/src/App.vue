<template>
  <v-app>
    <Header />
    <v-content class="grey lighten-3">
      <router-view />
    </v-content>
  </v-app>
</template>

<script>
import Header from "./components/Header";

export default {
  name: "App",

  components: {
    Header
  },

  data: () => ({
    //
  })
};
</script>
