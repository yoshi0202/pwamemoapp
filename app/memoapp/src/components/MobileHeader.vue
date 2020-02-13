<template>
  <v-app-bar app dark flat color="black" class="snippy-header">
    <v-layout justify="space-between">
      <v-container pa-0 class="d-flex align-center">
        <v-icon v-if="$route.name !== 'home'" color="#C7B967" large @click="$router.push('/')">mdi-chevron-left</v-icon>
      </v-container>
      <v-container pa-0 text-center class="d-flex align-center">
        <TopButton />
      </v-container>
      <v-container pa-0 class="d-flex align-center justify-end">
        <span v-if="$store.getters.getLoginStatus">
          <v-avatar>
            <img
              :src="$store.getters.getImgUrl"
              alt="avator"
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
  </v-app-bar>
</template>

<script>
import TopButton from "./TopButton";

export default {
  Name: "MobileHeader",
  data: () => ({
    items: [{ title: "設定" }, { title: "ログアウト" }]
  }),
  components: {
    TopButton
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

<style></style>
