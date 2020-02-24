<template>
  <v-content class="grey lighten-3">
    <ErrorSnackbar v-if="$store.getters.getErrorMsg" />
    <v-container v-if="$store.getters.getLoadingStatus" fill-height fluid>
      <Loading />
    </v-container>
    <v-container v-else fill-height>
      <v-layout class="justify-center" wrap>
        <v-flex xs12 sm12 md12 lg10 xl8>
          <v-card outlined tile height="100%">
            <v-list-item style="background-color:#000000;" dark>
              <v-card-title class="py-3">
                <h1 class="font-weight-bold display-1 white--text">Profile</h1>
              </v-card-title>
            </v-list-item>
            <v-container py-5>
              <!-- <v-container> -->
              <v-layout wrap>
                <v-flex xs12 sm12 md4 lg5 xl4>
                  <v-container style="max-width:100%">
                    <v-img
                      :src="userData.userData.imgUrl"
                      alt="avatar"
                      aspect-ratio="1"
                      class="grey lighten-2"
                      max-height="100%"
                    ></v-img>
                  </v-container>
                  <v-container headline text-left px-10 fluid>
                    {{ userData.userData.displayName }}
                    <v-container fluid body-1 ma-0 pa-0 font-weight-light>@{{ userData.userData.userId }}</v-container>
                    <UserPageIcons :userData="userData" />
                    <v-divider></v-divider>
                    <v-container subtitle-1 fluid px-0 style="word-break:break-all">
                      {{ userData.userData.description }}
                    </v-container>
                    <v-divider></v-divider>
                  </v-container>
                </v-flex>
                <v-flex xs12 sm12 md8 lg7 xl8>
                  <v-container pa-0>
                    <v-card tile elevation="0" color="black">
                      <v-card-title class="text-center justify-center">
                        <h3 class="headline white--text">UserSnippets</h3>
                      </v-card-title>

                      <v-tabs v-model="tab" background-color="white" color="purple lighten-2" grow>
                        <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
                      </v-tabs>

                      <v-tabs-items v-model="tab">
                        <v-tab-item v-for="(key, i) in userData.snippets" :key="i">
                          <v-divider></v-divider>
                          <v-card tile outlined elevation="0" v-for="snippets in key" :key="snippets.snipId">
                            <v-list two-line subheader>
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
                                  <v-list-item-title>{{ snippets.snipData.title }}</v-list-item-title>
                                  <v-list-item-subtitle
                                    v-text="changeUnixTime(snippets.createdAt, 'getFullTimestamp')"
                                  ></v-list-item-subtitle>
                                </v-list-item-content>

                                <v-list-item-action>
                                  <v-btn icon>
                                    <v-icon @click="toSnip(snippets.userId, snippets.snipId)" color="grey lighten-1"
                                      >mdi-chevron-double-right</v-icon
                                    >
                                  </v-btn>
                                </v-list-item-action>
                              </v-list-item>
                            </v-list>
                            <v-divider></v-divider>
                          </v-card>
                        </v-tab-item>
                      </v-tabs-items>
                    </v-card>
                  </v-container>
                </v-flex>
              </v-layout>
              <!-- </v-container> -->
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
      items: ["MySnippets", "Pin"],
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
