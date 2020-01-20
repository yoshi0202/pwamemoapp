<template>
  <v-app>
    <Header @toggleMenu="toggle" />
    <v-content class="grey lighten-3">
      <router-view />
    </v-content>
    <v-navigation-drawer v-model="drawer" app temporary right>
      <v-list-item>
        <v-list-item-content>
          <v-layout>
            <v-list-item-title>Menu</v-list-item-title>
            <v-layout text-right>
              <v-icon @click="toggle">mdi-close</v-icon>
            </v-layout>
          </v-layout>
        </v-list-item-content>
      </v-list-item>

      <v-divider></v-divider>
      <v-list dense>
        <v-list-item v-for="item in items" :key="item.title">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
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
    drawer: false,
    items: [
      { title: "Login", icon: "mdi-login" },
      { title: "My Page", icon: "mdi-account" },
      { title: "Add Card", icon: "fas fa-edit" }
    ]
  }),
  methods: {
    toggle: function() {
      this.drawer = !this.drawer;
    }
  }
};
</script>
