<template>
  <v-container pa-0>
    <v-app-bar app dark flat color="black" class="snippy-header">
      <v-layout justify="space-between">
        <v-container pa-0 class="d-flex align-center">
          <v-icon
            v-if="$route.name !== 'home'"
            color="#C7B967"
            large
            @click="$router.push('/')"
          >mdi-chevron-left</v-icon>
        </v-container>
        <v-container pa-0 text-center class="d-flex align-center">
          <TopButton />
        </v-container>
        <v-container pa-0 class="d-flex align-center justify-end">
          <span v-if="$store.getters.getLoginStatus">
            <v-avatar>
              <img
                :src="$store.getters.getImgUrl"
                alt="avatar"
                @click="$store.dispatch('toggleDrawer')"
                style="cursor:pointer"
              />
            </v-avatar>
          </span>
          <span v-else>
            <v-icon color="#C7B967" @click="$store.dispatch('toggleDrawer')">mdi-dots-vertical</v-icon>
          </span>
        </v-container>
      </v-layout>
      <template v-slot:extension v-if="$route.name !== 'addSnippets'">
        <v-container pa-0 ma-0>
          <Search />
        </v-container>
      </template>
    </v-app-bar>
  </v-container>
</template>

<script>
import TopButton from "./TopButton";
import Search from "./Search";

export default {
  Name: "MobileHeader",
  data: () => ({
    items: [{ title: "設定" }, { title: "ログアウト" }]
  }),
  components: {
    TopButton,
    Search
  },
  created: function() {
    console.log(this.$route.name);
  },
  methods: {
    myPage: function() {
      const user = this.$store.getters.getLogin;
      this.$router.push("/user/" + user.userId);
    },
    editPage: function() {
      const user = this.$store.getters.getLogin;
      this.$router.push("/user/" + user.userId + "/edit");
    }
  }
};
</script>

<style>
.v-toolbar__extension {
  background-color: #e0e0e0 !important;
}
</style>
