<template>
  <v-app-bar app dark color="#147F9B">
    <v-btn to="/" text class="#FDB436">
      <div class="d-flex align-center">Snippy</div>
    </v-btn>

    <v-spacer></v-spacer>

    <span v-if="loginStatus">
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
    <v-icon color="#FDB436" @click="toggleMenu">mdi-menu</v-icon>
  </v-app-bar>
</template>

<script>
import axios from "axios";
import isMobile from "ismobilejs";

export default {
  Name: "Header",
  data: function() {
    return {
      loginStatus: false,
      userId: "",
      id: ""
    };
  },
  computed: {
    status() {
      return this.$store.getters.getLoginStatus;
    }
  },
  watch: {
    status(val) {
      this.loginStatus = val.status;
      this.userId = val.userId;
      this.id = val.id;
    }
  },
  created: function() {
    if (!isMobile().any) {
      alert(isMobile().any);
    }
  },
  methods: {
    logout: async function() {
      const loginStatus = this.$store.getters.getLoginStatus;
      await axios.delete("https://u65qbs6yva.execute-api.ap-northeast-1.amazonaws.com/prod/api/logout", {
        data: {
          userid: loginStatus.userId,
          loginToken: loginStatus.loginToken
        }
      });
      await this.$store.dispatch("updateLoginStatus", {
        status: false,
        loginToken: "",
        userId: ""
      });
      this.loginStatus = false;
      this.$router.push("/");
    },
    mypage: function() {
      this.$router.push("/" + this.id + "/mypage");
    },
    toggleMenu: function() {
      this.$emit("toggleMenu");
    }
  }
};
</script>

<style></style>
