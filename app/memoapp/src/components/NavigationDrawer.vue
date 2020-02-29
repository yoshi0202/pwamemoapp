<template>
  <v-navigation-drawer v-model="$store.getters.getDrawer" app temporary right>
    <v-list-item>
      <v-container fluid pa-0 ma-0>
        <v-list-item-content>
          <v-layout>
            <v-list-item-title>
              <v-avatar v-if="$store.getters.getLoginStatus" color="grey lighten-2">
                <v-img :src="$store.getters.getImgUrl" alt="avatar" style="cursor:pointer" />
              </v-avatar>
              <span class="blue-grey--text text--darken-3 font-weight-bold">
                <span class="ma-5">{{ $store.getters.getDisplayName }}</span>
              </span>
            </v-list-item-title>
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
    <v-divider></v-divider>
    <v-list dense>
      <v-container pa-0 text-left>
        <v-list-item to="/about">
          <v-list-item-avatar tile size="20px">
            <v-icon class="px-2">mdi-information-outline</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title class="font-weight-bold caption blue-grey--text text--darken-3"
              >Snippyについて</v-list-item-title
            >
          </v-list-item-content>
          <v-list-item-action>
            <v-icon color="blue-grey darken-3">mdi-chevron-right</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-container>
    </v-list>
    <v-divider></v-divider>
    <CategoryMenu />
  </v-navigation-drawer>
</template>

<script>
import LoginMenu from "./LoginMenu";
import LogoutMenu from "./LogoutMenu";
import CategoryMenu from "./CategoryMenu";

export default {
  Name: "NavigationDrawer",
  props: {},
  data: () => ({
    drawer: false
  }),
  created: function() {},
  methods: {
    logout: function() {
      this.$emit("logout");
    }
  },
  components: {
    LoginMenu,
    LogoutMenu,
    CategoryMenu
  }
};
</script>

<style></style>
