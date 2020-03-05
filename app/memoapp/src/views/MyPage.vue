<template>
  <v-content class="grey lighten-3">
    <ErrorSnackbar v-if="$store.getters.getErrorMsg" />
    <v-container v-if="$store.getters.getLoadingStatus" fill-height fluid>
      <Loading />
    </v-container>
    <v-container v-else fill-height>
      <v-layout class="justify-center" wrap>
        <v-flex xs12 sm12 md12 lg8 xl6>
          <v-card tile elevation="0" class="menu-card">
            <v-container
              font-weight-bold
              d-flex
              justify-space-between
              align-center
              blue-grey--text
              text--darken-3
              title
            >
              <v-icon large>mdi-account-circle</v-icon>
              <span>マイページ</span>
              <span></span>
            </v-container>
          </v-card>
          <v-container pa-0><v-divider></v-divider></v-container>
          <v-card tile elevation="0">
            <v-container py-2>
              <v-layout wrap>
                <v-flex xs12 sm12 md4 lg5 xl4>
                  <v-card elevation="0" outlined tile class="ma-1">
                    <v-container pa-0>
                      <v-img
                        :src="userData.userData.imgUrl"
                        alt="avatar"
                        aspect-ratio="1"
                        class="grey lighten-2"
                        max-height="100%"
                      ></v-img>
                    </v-container>
                    <v-container><v-divider></v-divider></v-container>
                    <v-container title text-left py-0 blue-grey--text text--darken-3>
                      {{ userData.userData.displayName }}
                      <v-container fluid body-1 ma-0 pa-0 subtitle>@{{ userData.userData.userId }}</v-container>
                      <UserPageIcons :userData="userData" />
                      <v-divider></v-divider>
                      <v-container subtitle-1 fluid px-0 style="word-break:break-all">
                        {{ userData.userData.description }}
                      </v-container>
                    </v-container>
                  </v-card>
                </v-flex>
                <v-flex xs12 sm12 md8 lg7 xl8>
                  <v-container pa-1>
                    <v-card tile outlined elevation="0">
                      <v-container
                        text-center
                        blue-grey--text
                        text--darken-3
                        font-weight-bold
                        d-flex
                        justify-space-between
                        align-center
                      >
                        <v-icon>mdi-account-edit</v-icon>
                        <span>ユーザスニペット</span>
                        <span></span>
                      </v-container>
                      <v-container pa-0><v-divider></v-divider></v-container>
                      <v-tabs v-model="tab" color="#C7B967" show-arrows grow>
                        <v-tab v-for="item in items" :key="item" class="caption blue-grey--text text--darken-3 pa-0">{{
                          item
                        }}</v-tab>
                      </v-tabs>

                      <v-tabs-items v-model="tab">
                        <v-divider></v-divider>
                        <v-tab-item v-for="(key, i) in userData.snippets" :key="i">
                          <v-card tile outlined elevation="0" v-for="snippets in key" :key="snippets.snipId">
                            <v-list class="pa-0">
                              <v-list-item
                                @click="
                                  toSnip(snippets.snipUserId ? snippets.snipUserId : snippets.userId, snippets.snipId)
                                "
                              >
                                <v-list-item-avatar>
                                  <v-img
                                    :src="snippets.userImgUrl ? snippets.userImgUrl : userData.userData.imgUrl"
                                  ></v-img>
                                </v-list-item-avatar>

                                <v-list-item-content>
                                  <v-list-item-title
                                    class="font-weight-bold subtitle-1 blue-grey--text text--darken-3"
                                    >{{ snippets.snipData.title }}</v-list-item-title
                                  >
                                  <v-list-item-subtitle>
                                    <span v-for="t in snippets.snipData.tags" :key="t" class="mr-3">
                                      <img :src="'/img/' + t + '.svg'" height="15" width="auto" />
                                    </span>
                                  </v-list-item-subtitle>
                                  <v-list-item-subtitle
                                    v-text="changeUnixTime(snippets.createdAt, 'getFullTimestamp')"
                                  ></v-list-item-subtitle>
                                </v-list-item-content>

                                <v-list-item-action>
                                  <v-btn icon>
                                    <v-icon @click="toSnip(snippets.userId, snippets.snipId)" color="blue-grey darken-3"
                                      >mdi-chevron-right</v-icon
                                    >
                                  </v-btn>
                                </v-list-item-action>
                              </v-list-item>
                            </v-list>
                          </v-card>
                        </v-tab-item>
                      </v-tabs-items>
                    </v-card>
                  </v-container>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>
<script>
import axios from "axios";
import Loading from "@/components/Loading";
import UserPageIcons from "@/components/UserPageIcons";
import ErrorSnackbar from "@/components/ErrorSnackbar";
import Mixin from "../mixin/mixin";

export default {
  name: "MyPage",
  watch: {
    $route(next, current) {
      if (next.path !== current.path) {
        this.$router.go({ path: next.path, force: true });
      }
    }
  },
  created: async function() {
    try {
      this.$store.dispatch("initializeErrorMsg");
      this.$store.dispatch("changeLoading", true);
      const userId = this.$route.params.userId;
      const apiUrl = this.$store.getters.getApiUrl + "api/";
      const result = await axios.get(apiUrl + "user/" + userId);
      if (userId === this.$store.getters.getUserId) {
        this.items = ["投稿", "ピン", "メモ"];
      } else {
        console.log("higehogej");
        this.items = ["投稿", "ピン"];
      }
      this.userData = result.data;
      this.$store.dispatch("changeLoading", false);
    } catch (err) {
      this.$store.dispatch("changeLoading", false);
      this.$store.dispatch("updateErorrMsg");
    }
  },
  data: function() {
    return {
      tab: null,
      items: [],
      userData: {
        userData: ""
      },
      userId: "",
      userImg: ""
    };
  },
  methods: {
    toSnip: function(userId, snippetsId) {
      this.$router.push("/" + userId + "/snip/" + snippetsId);
    }
  },
  components: {
    Loading,
    UserPageIcons,
    ErrorSnackbar
  },
  mixins: [Mixin]
};
</script>
