<template>
  <v-navigation-drawer v-model="$store.getters.getDrawer" app temporary right>
    <v-list-item>
      <v-container fluid pa-0 ma-0>
        <v-list-item-content>
          <v-layout>
            <v-list-item-title>Menu</v-list-item-title>
            <v-layout text-right>
              <v-icon @click="$store.dispatch('toggleDrawer')">mdi-close</v-icon>
            </v-layout>
          </v-layout>
        </v-list-item-content>
      </v-container>
    </v-list-item>

    <v-divider></v-divider>
    <v-list dense>
      <div v-if="$store.getters.getLoginStatus">
        <LoginMenu @logout="logout" />
      </div>
      <div v-else>
        <LogoutMenu />
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
import LoginMenu from "./LoginMenu";
import LogoutMenu from "./LogoutMenu";

export default {
  Name: "NavigationDrawer",
  data: () => ({}),
  created: function() {},
  methods: {
    logout: function() {
      this.$emit("logout");
    }
  },
  components: {
    LoginMenu,
    LogoutMenu
  }
};
</script>

<style></style>
