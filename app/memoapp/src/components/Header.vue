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
        <v-avatar>
          <img :src="$store.getters.getImgUrl" alt="avator" @click="mypage" style="cursor:pointer" />
        </v-avatar>
        <v-btn class="ma-2" outlined color="#FDB436" @click="$emit('logout')">
          <span class="mr-2">Logout</span>
        </v-btn>
      </span>
      <span v-else>
        <v-btn class="ma-2" outlined color="#FDB436" to="/login">
          <span class="mr-2">Login</span>
        </v-btn>
      </span>
    </span>
  </v-app-bar>
</template>

<script>
export default {
  Name: "Header",
  data: () => ({}),
  component: {},
  created: function() {},
  methods: {
    mypage: function() {
      const user = this.$store.getters.getLogin;
      this.$router.push("/user/" + user.userId);
    }
  }
};
</script>

<style></style>
