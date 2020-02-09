<template>
  <v-content>
    <v-container fill-height>
      <v-layout class="justify-center" wrap>
        <v-flex xs12 sm12 md12 lg10 xl8>
          <v-card outlined height="100%">
            <v-list-item style="background-color:#000000;" dark>
              <v-card-title class="py-3">
                <h1 class="font-weight-bold headline white--text">Profile</h1>
              </v-card-title>
            </v-list-item>
            <v-container pa-5>
              <v-container>
                <v-layout wrap>
                  <v-flex xs12 sm12 md12 lg5 xl4>
                    <v-container fluid text-center>
                      <v-img
                        :src="userData.userData.imgUrl"
                        alt="avator"
                        aspect-ratio="1"
                        class="grey lighten-2"
                        style="cursor: pointer;"
                        max-width="500"
                        max-height="500"
                      ></v-img>
                      iner headline text-left px-10 fluid>
                      {{ userData.userData.displayName }}
                      <v-container
                        fluid
                        body-1
                        ma-0
                        pa-0
                        font-weight-light
                      >@{{ userData.userData.userId }}</v-container>
                      <v-container fluid ma-0 pa-0>
                        <v-icon
                          v-if="userData.userData.url"
                          class="pr-5"
                          color="purple lighten-2"
                          @click="toSns(userData.userData.url)"
                        >mdi-home</v-icon>
                        <v-icon
                          v-if="userData.userData.twitter"
                          class="pr-5"
                          color="#00acee"
                          @click="toSns(userData.userData.twitter)"
                        >mdi-twitter</v-icon>
                        <v-icon
                          v-if="userData.userData.qiita"
                          class="pr-5"
                          color="#55C500"
                          @click="toSns(userData.userData.qiita)"
                        >mdi-quora</v-icon>
                        <v-icon
                          v-if="userData.userData.github"
                          class="pr-5"
                          color="#171515"
                          @click="toSns(userData.userData.github)"
                        >mdi-github-circle</v-icon>
                      </v-container>
                      <v-divider></v-divider>
                      <v-container subtitle-1 fluid px-0 style="word-break:break-all">
                        {{
                        userData.userData.description
                        }}
                      </v-container>
                      <v-divider></v-divider>
                    </v-container>
                  </v-flex>
                  <v-flex xs12 sm12 md12 lg7 xl8>
                    <v-card color="basil">
                      <v-card-title class="text-center justify-center py-6">
                        <h1 class="font-weight-bold display-1 basil--text">User Snippets</h1>
                      </v-card-title>

                      <v-tabs
                        v-model="tab"
                        background-color="transparent"
                        color="#FDB436"
                        grow
                        dark
                      >
                        <v-tab v-for="item in items" :key="item">{{ item }}</v-tab>
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

                              <v-divider></v-divider>
                            </v-list>
                          </v-card>
                        </v-tab-item>
                      </v-tabs-items>
                    </v-card>
                  </v-flex>
                </v-layout>
              </v-container>
            </v-container>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-content>
</template>

<script>
import axios from "axios";
// import Loading from "@/components/Loading";

export default {
  name: "EditMyPage",
  created: async function() {
    const userId = this.$route.params.userId;
    const apiUrl = this.$store.getters.getApiUrl + "api/";
    const result = await axios.get(apiUrl + "user/" + userId);
    this.userData = result.data;
    this.$store.dispatch("changeLoading", false);
  },
  data: function() {
    return {
      userData: {
        userData: ""
      },
      userId: "",
      userImg: ""
    };
  },
  methods: {
    // toSnip: function(userId, snippetsId) {
    //   this.$router.push("/" + userId + "/snip/" + snippetsId);
    // },
    // toSns: function(path) {
    //   window.open(path, "_blank");
    // },
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
    },
    updateUser: async function() {
      try {
        const userId = this.$route.params.userId;
        const apiUrl = this.$store.getters.getApiUrl + "api/";
        await axios.post(apiUrl + "user/" + userId + "/profile/update", {
          displayName: this.userData.userData.displayName,
          description: this.userData.userData.description,
          url: this.userData.userData.url,
          twitter: this.userData.userData.twitter,
          github: this.userData.userData.github,
          qiita: this.userData.userData.qiita
        });
        this.$router.push("/user/" + userId);
      } catch (err) {
        alert(JSON.stringify(err));
      }
    }
  },
  components: {
    // Loading
  }
};
</script>

<style scoped>
/* Helper classes */
/* .basil {
  background-color: #147f9b !important;
}
.basil--text {
  color: white !important;
} */
.input-border {
  /* border-radius: 0; */
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}
.input-container-border {
  border-top-left-radius: 10;
  border-bottom-left-radius: inherit;
  border: solid;
}
</style>
