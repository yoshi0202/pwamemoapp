<template>
  <v-content>
    <v-container fill-height>
      <v-layout class="justify-center" wrap>
        <v-flex xs12 sm12 md12 lg10 xl8>
          <Loading />
          <v-card outlined height="100%">
            <v-list-item style="background-color:#000000;" dark>
              <v-card-title class="py-3">
                <h1 class="font-weight-bold display-1 white--text">Profile</h1>
              </v-card-title>
            </v-list-item>
            <v-container py-5>
              <!-- <v-container> -->
              <v-layout wrap>
                <v-flex xs12 sm12 md12 lg5 xl4>
                  <v-container fluid text-center>
                    <v-img
                      :src="userData.userData.imgUrl"
                      alt="avator"
                      aspect-ratio="1"
                      class="grey lighten-2"
                      max-width="500"
                      max-height="500"
                    >
                      <template v-slot:placeholder></template>
                    </v-img>
                  </v-container>
                  <v-container headline text-left px-10 fluid>
                    {{ userData.userData.displayName }}
                    <v-container
                      fluid
                      body-1
                      ma-0
                      pa-0
                      font-weight-light
                    >@{{ userData.userData.userId }}</v-container>
                    <UserPageIcons :userData="userData" />
                    <v-divider></v-divider>
                    <v-container
                      subtitle-1
                      fluid
                      px-0
                      style="word-break:break-all"
                    >{{userData.userData.description}}</v-container>
                    <v-divider></v-divider>
                  </v-container>
                </v-flex>
                <v-flex xs12 sm12 md12 lg7 xl8>
                  <v-container pa-0>
                    <v-card color="black">
                      <v-card-title class="text-center justify-center">
                        <h3 class="headline white--text">Snippets</h3>
                      </v-card-title>

                      <v-tabs v-model="tab" background-color="white" color="purple lighten-2" grow>
                        <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
                      </v-tabs>

                      <v-tabs-items v-model="tab">
                        <v-tab-item v-for="(key, i) in userData.snippets" :key="i">
                          <v-divider></v-divider>
                          <v-card color="basil" flat v-for="snippets in key" :key="snippets.snipId">
                            <v-list two-line subheader>
                              <v-list-item
                                @click="toSnip(snippets.snipUserId ? snippets.snipUserId : snippets.userId , snippets.snipId)"
                              >
                                <v-list-item-avatar>
                                  <v-img
                                    :src="snippets.userImgUrl ? snippets.userImgUrl : userData.userData.imgUrl"
                                  ></v-img>
                                </v-list-item-avatar>

                                <v-list-item-content>
                                  <v-list-item-title>{{ snippets.snipData.title }}</v-list-item-title>
                                  <v-list-item-subtitle>{{ changeUnixTimeToDate(snippets.createdAt) }}</v-list-item-subtitle>
                                </v-list-item-content>

                                <v-list-item-action>
                                  <v-btn icon>
                                    <v-icon
                                      @click="toSnip(snippets.userId, snippets.snipId)"
                                      color="grey lighten-1"
                                    >mdi-chevron-double-right</v-icon>
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
import Mixin from "../mixin/mixin";

export default {
  name: "MyPage",
  created: async function() {
    const userId = this.$route.params.userId;
    const apiUrl = this.$store.getters.getApiUrl + "api/";
    const result = await axios.get(apiUrl + "user/" + userId);
    this.userData = result.data;
    this.$store.dispatch("changeLoading", false);
    console.log(this.userData);
  },
  data: function() {
    return {
      tab: null,
      items: ["MySnippets", "Favorites"],
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
    },
    changeUserImg: async function(e) {
      const apiUrl = this.$store.getters.getApiUrl + "api/";
      e.preventDefault();
      let formData = new FormData();
      formData.append("avatar", e.target.files[0]);
      let config = {
        headers: {
          "content-type": "multipart/form-data"
        }
      };
      await axios.post(apiUrl + "user/" + this.$route.params.userId + "/changeImg", formData, config);
    },
    imgClick: function() {
      this.$refs.fileUploads.click();
    }
  },
  components: {
    Loading,
    UserPageIcons
  },
  mixins: [Mixin]
};
</script>

<style scoped>
/* Helper classes */
.basil {
  background-color: #147f9b !important;
}
.basil--text {
  color: white !important;
}
</style>
