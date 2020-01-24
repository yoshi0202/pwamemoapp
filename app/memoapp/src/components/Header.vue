<template>
  <v-app-bar app dark color="#147F9B">
    <v-btn to="/" text class="#FDB436">
      <div class="d-flex align-center">Snippy</div>
    </v-btn>

    <v-spacer></v-spacer>

    <span v-if="$store.getters.getIsMobile">
      <v-icon color="#FDB436" @click="$store.dispatch('toggleDrawer')">mdi-menu</v-icon>
    </span>
    <span v-else>
      <span v-if="$store.getters.getLoginStatus">
        <v-btn class="ma-2" outlined color="#FDB436" @click="mypage">
          <span class="mr-2">MyPage</span>
        </v-btn>
        <v-btn class="ma-2" outlined color="#FDB436" @click="logout">
          <span class="mr-2">Logout</span>
        </v-btn>
      </span>
      <span v-else>
        <v-btn class="ma-2" outlined color="#FDB436" to="/login">
          <span class="mr-2">Login</span>
        </v-btn>
      </span>
      <v-btn to="/addCard" outlined color="#FDB436">
        <span class="mr-2">add Cards!</span>
        <v-icon small>fas fa-edit</v-icon>
      </v-btn>
    </span>
  </v-app-bar>
</template>

<script>
import axios from "axios";

export default {
  Name: "Header",
  data: () => ({}),
  component: {},
  created: function() {},
  methods: {
    logout: async function() {
      const userInfo = this.$store.getters.getLogin;
      await axios.delete("https://u65qbs6yva.execute-api.ap-northeast-1.amazonaws.com/prod/api/logout", {
        data: {
          userid: userInfo.userId,
          loginToken: userInfo.loginToken
        }
      });
      this.$store.dispatch("updateLoginStatus", {
        status: false,
        loginToken: "",
        userId: ""
      });
      this.$router.push("/");
    },
    mypage: function() {
      const user = this.$store.getters.getLogin;
      this.$router.push("/" + user.id + "/mypage");
    }
  }
};
</script>

<style></style>
