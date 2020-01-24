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
        <v-list-item v-for="li in loginItems" :key="li">
          <v-list-item-icon>
            <v-icon>{{ li.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title @click="$router.push(li.link)">{{ li.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
      <div v-else>
        <v-list-item v-for="li in logoutItems" :key="li">
          <v-list-item-icon>
            <v-icon>{{ li.icon }}</v-icon>
          </v-list-item-icon>

          <v-list-item-content>
            <v-list-item-title @click="$router.push(li.link)">{{ li.title }}</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>

<script>
export default {
  Name: "NavigationDrawer",
  data: () => ({
    loginItems: [
      { title: "My Page", icon: "mdi-account", link: "/mypage" },
      { title: "Add Card", icon: "fas fa-edit", link: "/addCard" },
      { title: "logout", icon: "mdi-logout", link: "/logout" }
    ],
    logoutItems: [{ title: "Login", icon: "mdi-login", link: "/login" }]
  }),
  created: function() {},
  methods: {}
};
</script>

<style></style>
