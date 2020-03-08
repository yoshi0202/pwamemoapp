<template>
  <v-app-bar app dark flat color="grey darken-4" class="snippy-header">
    <v-container fluid pa-0>
      <v-layout class="align-center justify-space-between">
        <TopButton />
        <Search />
        <v-spacer></v-spacer>
        <span v-if="$store.getters.getErrorMsg">
          <v-icon large color="white" @click="$router.go({ path: '/', force: true })">mdi-refresh</v-icon>
        </span>
        <span v-else-if="$store.getters.getLoginStatus">
          <v-menu left offset-x>
            <template v-slot:activator="{ on }">
              <v-badge :value="$store.getters.getUnreadNotify" dot color="red" overlap>
                <v-avatar v-on="on" color="grey lighten-2">
                  <v-img :src="$store.getters.getImgUrl" alt="avatar" style="cursor:pointer" />
                </v-avatar>
              </v-badge>
            </template>

            <v-list>
              <v-list-item @click="myPage" style="cursor:pointer">
                <v-list-item-title>
                  <span class="caption">
                    <v-icon medium>mdi-account</v-icon>
                    <span class="ml-3">マイページ</span>
                  </span>
                </v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item @click="goNotification" style="cursor:pointer">
                <v-list-item-title>
                  <span class="caption">
                    <v-icon medium>mdi-bell-outline</v-icon>
                    <span class="ml-3">通知</span>
                  </span>
                </v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item @click="editPage" style="cursor:pointer">
                <v-list-item-title>
                  <span class="caption">
                    <v-icon medium>mdi-tune</v-icon>
                    <span class="ml-3">設定</span>
                  </span>
                </v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item @click="$emit('logout')" style="cursor:pointer">
                <v-list-item-title>
                  <span class="caption">
                    <v-icon medium>mdi-logout</v-icon>
                    <span class="ml-3">ログアウト</span>
                  </span>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </span>
        <span v-else>
          <v-btn class="white--text ma-2" to="/login">
            <v-icon class="mr-2">mdi-login-variant</v-icon>
            <span>ログイン</span>
          </v-btn>
        </span>
      </v-layout>
    </v-container>
  </v-app-bar>
</template>

<script>
import TopButton from "@/components/TopButton";
import Search from "@/components/Search";
import Pusher from "pusher-js";
import axios from "axios";
import Store from "@/store/index.js";
const apiUrl = Store.getters.getApiUrl + "api/";

export default {
  Name: "Header",
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
    this.subscribe();
    if (!this.$store.getters.getUserId) return;
    let userId = this.$store.getters.getUserId;
    let isUnreadNotify = await axios.get(apiUrl + "user/" + userId + "/unreadNotify");
    this.$store.dispatch("notify", isUnreadNotify.data.bool);
  },
  methods: {
    myPage: function() {
      const user = this.$store.getters.getLogin;
      this.$router.push("/user/" + user.userId);
    },
    goNotification: function() {
      const userId = this.$store.getters.getUserId;
      this.$router.push("/user/" + userId + "/notification");
    },
    editPage: function() {
      const user = this.$store.getters.getLogin;
      this.$router.push("/user/" + user.userId + "/edit");
    },
    subscribe: function() {
      let pusher = new Pusher(process.env.VUE_APP_PUSHER_KEY, { cluster: "ap3" });
      Pusher.logToConsole = process.env.NODE_ENV === "development" ? true : false;
      pusher.subscribe("notiChannel");
      let self = this;
      pusher.bind("pinAdd-event", function(data) {
        if (self.$store.getters.getUserId !== data.id) return;
        self.$store.dispatch("notify", true);
      });
    }
  }
};
</script>

<style></style>
