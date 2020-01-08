<template>
  <v-app-bar app dark class="orange lighten-2">
    <v-btn to="/" text class="orange lighten-2">
      <div class="d-flex align-center orange lighten-2">Snippy</div>
    </v-btn>

    <v-spacer></v-spacer>

    <span v-if="loginStatus">
      <v-btn class="ma-2" outlined color="white" @click="logout">
        <span class="mr-2">Logout</span>
      </v-btn>
    </span>
    <span v-else>
      <v-btn class="ma-2" outlined color="white" to="/login">
        <span class="mr-2">Login</span>
      </v-btn>
    </span>
    <v-btn to="/addCard" outlined>
      <span class="mr-2">add Cards!</span>
      <v-icon small>fas fa-edit</v-icon>
    </v-btn>
  </v-app-bar>
</template>

<script>
export default {
  Name: "Header",
  data: function() {
    return {
      loginStatus: false
    };
  },
  computed: {
    status() {
      return this.$store.getters.getLoginStatus;
    }
  },
  watch: {
    status(val) {
      this.loginStatus = val;
    }
  },
  mounted: function() {},
  methods: {
    logout: async function() {
      await this.$store.dispatch("updateLoginStatus", this.loginStatus);
      this.loginStatus = this.$store.getters.getLoginStatus;
      this.$router.push("/");
    }
  }
};
</script>

<style></style>
