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
          <span v-if="$store.getters.getErrorMsg">
            <v-icon large color="red" @click="$router.go({ path: '/', force: true })">mdi-refresh</v-icon>
          </span>
          <span v-else-if="$store.getters.getLoginStatus">
            <v-badge :value="$store.getters.getUnreadNotify" color="red" dot overlap>
              <v-avatar color="grey lighten-2">
                <v-img
                  :src="$store.getters.getImgUrl"
                  alt="avatar"
                  @click="$store.dispatch('toggleDrawer')"
                  style="cursor:pointer"
                />
              </v-avatar>
            </v-badge>
          </span>
          <span v-else>
            <v-icon color="white" @click="$store.dispatch('toggleDrawer')">mdi-dots-vertical</v-icon>
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
import Pusher from "pusher-js";
import axios from "axios";
import Store from "@/store/index.js";
const apiUrl = Store.getters.getApiUrl + "api/";

export default {
  Name: "MobileHeader",
  data: function() {
    return {
      items: [{ title: "設定" }, { title: "ログアウト" }]
    };
  },
  components: {
    TopButton,
    Search
  },
  created: async function() {
    if (!this.$store.getters.getUserId) return;
    this.subscribe();
    let userId = this.$store.getters.getUserId;
    let isUnreadNotify = await axios.get(apiUrl + "user/" + userId + "/unreadNotify");
    this.$store.dispatch("notify", isUnreadNotify.data.bool);
  },
  methods: {
    myPage: function() {
      const user = this.$store.getters.getLogin;
      this.$router.push("/user/" + user.userId);
    },
    editPage: function() {
      const user = this.$store.getters.getLogin;
      this.$router.push("/user/" + user.userId + "/edit");
    },
    subscribe() {
      let pusher = new Pusher(process.env.VUE_APP_PUSHER_KEY, { cluster: "ap3" });
      Pusher.logToConsole = true;
      pusher.subscribe("notiChannel" + this.$store.getters.getUserId);
      pusher.bind("pinAdd-event", () => {
        this.$store.dispatch("notify", true);
      });
    }
  }
};
</script>

<style>
.v-toolbar__extension {
  background-color: #e0e0e0 !important;
}
</style>
