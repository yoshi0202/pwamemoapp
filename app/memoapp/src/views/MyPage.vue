<template>
  <v-container fluid fill-height>
    <v-layout>
      <v-flex lg8 md10 offset-lg2 offset-md1 text-center white>
        <Loading />
        <v-container text-center fill-height fluid>
          <v-layout fluid>
            <v-flex fluid>
              <v-layout wrap fluid>
                <v-flex lg5 md5 sm12 fluid>
                  <img
                    :src="userData.userData.imgUrl"
                    alt="avator"
                    style="width:300px;height:300px;cursor: pointer;"
                    @click="imgClick"
                  />
                  <input type="file" style="display:none" ref="fileUploads" name="avatar" @change="changeUserImg" />
                  <v-container headline text-left px-10 fluid>
                    {{ userData.userData.userId }}
                    <v-container fluid body-1 ma-0 pa-0 font-weight-light>{{ userData.userData.userId }}</v-container>
                    <v-container fluid ma-0 pa-0>
                      <v-icon class="pr-5" color="#00acee" @click="toSns('https://twitter.com/codeplumdev')"
                        >mdi-twitter</v-icon
                      >
                      <v-icon class="pr-5" color="#55C500" @click="toSns('https://qiita.com/yoshiplum')"
                        >mdi-quora</v-icon
                      >
                      <v-icon class="pr-5" color="#171515" @click="toSns('https://github.com/yoshi0202')"
                        >mdi-github-circle</v-icon
                      >
                    </v-container>
                    <v-divider></v-divider>
                    <v-container subtitle-1 fluid px-0 style="word-break:break-all">
                      DescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescriptionDescription
                    </v-container>
                    <v-divider></v-divider>
                  </v-container>
                </v-flex>
                <v-flex lg7 md7 sm12>
                  <v-card color="basil">
                    <v-card-title class="text-center justify-center py-6">
                      <h1 class="font-weight-bold display-1 basil--text">User Snippets</h1>
                    </v-card-title>

                    <v-tabs v-model="tab" background-color="transparent" color="#FDB436" grow dark>
                      <v-tab v-for="item in items" :key="item">
                        {{ item }}
                      </v-tab>
                    </v-tabs>

                    <v-tabs-items v-model="tab">
                      <v-tab-item v-for="(key, i) in userData.snippets" :key="i">
                        <v-card color="basil" flat v-for="snippets in key" :key="snippets.snipId">
                          <v-list two-line subheader>
                            <v-list-item @click="toSnip(snippets.userId, snippets.snipId)">
                              <v-list-item-avatar>
                                <v-img :src="userData.userData.imgUrl"></v-img>
                              </v-list-item-avatar>

                              <v-list-item-content>
                                <v-list-item-title>{{ snippets.snipData.title }}</v-list-item-title>
                                <v-list-item-subtitle>{{
                                  changeUnixTimeToDate(snippets.createdAt)
                                }}</v-list-item-subtitle>
                              </v-list-item-content>

                              <v-list-item-action>
                                <v-btn icon>
                                  <v-icon @click="toSnip(snippets.userId, snippets.snipId)" color="grey lighten-1"
                                    >mdi-chevron-double-right</v-icon
                                  >
                                </v-btn>
                              </v-list-item-action>
                            </v-list-item>

                            <v-divider></v-divider>
                          </v-list>
                        </v-card>
                      </v-tab-item>
                    </v-tabs-items>
                  </v-card>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
import Loading from "@/components/Loading";
import Mixin from "../mixin/mixin";

export default {
  name: "MyPage",
  created: async function() {
    const userId = this.$route.params.userId;
    const apiUrl = this.$store.getters.getApiUrl + "api/";
    const result = await axios.get(apiUrl + "user/" + userId);
    this.userData = result.data;
    this.$store.dispatch("changeLoading", false);
  },
  data: function() {
    return {
      tab: null,
      items: ["MySnippets", "Favorites"],
      userData: {},
      userId: "",
      userImg: ""
    };
  },
  methods: {
    toSnip: function(userId, snippetsId) {
      this.$router.push("/" + userId + "/snip/" + snippetsId);
    },
    toSns: function(path) {
      window.open(path, "_blank");
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
    Loading
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
