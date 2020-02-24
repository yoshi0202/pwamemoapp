<template>
  <v-content class="grey lighten-3">
    <v-container v-if="$store.getters.getLoadingStatus" fill-height fluid>
      <Loading />
    </v-container>
    <v-container v-else fill-height>
      <v-layout class="justify-center" wrap>
        <v-flex xs12 sm12 md12 lg10 xl7 text-center>
          <v-container pa-0>
            <v-card tile elevation="0" class="mb-1">
              <v-container
                py-0
                transparent
                display-1
                font-weight-bold
                text-left
                blue-grey--text
                text--darken-3
                d-flex
                align-start
                justify-start
              >
                <v-list-item-avatar size="60" color="grey">
                  <img @click="toUserPage" :src="userData.imgUrl" alt="avatar" style="cursor: pointer;" />
                </v-list-item-avatar>

                <v-spacer></v-spacer>
                <v-btn class="pt-3" large dark icon @click="clickSnipPin">
                  <v-icon :color="pin.pinColor" class>{{ pin.pinIcon }}</v-icon>
                </v-btn>
                <v-menu offset-y v-if="ownSnip">
                  <template v-slot:activator="{ on }">
                    <v-btn class="pt-3" large dark icon v-on="on">
                      <v-icon color="#C7B967" class="ml-3">mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>
                  <v-list dense>
                    <v-list-item
                      @click="$router.push('/' + editParams.userId + '/snip/' + editParams.snipId + '/edit')"
                      style="cursor:pointer"
                    >
                      <v-list-item-title>
                        <span class="caption">
                          <v-icon medium>mdi-playlist-edit</v-icon>
                          <span class="ml-3">編集</span>
                        </span>
                      </v-list-item-title>
                    </v-list-item>
                    <v-list-item style="cursor:pointer" @click="overlay = !overlay">
                      <span class="caption">
                        <v-icon medium color="red">mdi-trash-can-outline</v-icon>
                        <span class="ml-3 red--text">削除</span>
                      </span>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-container>
              <v-container px-2 pb-0 transparent display-1 font-weight-bold text-left blue-grey--text text--darken-3>
                <span v-text="snipData.snipData.title"></span>
              </v-container>
              <v-container pa-0 text-right>
                <v-chip
                  dark
                  color="blue"
                  class="ma-2"
                  label
                  target="_blank"
                  :href="
                    'https://twitter.com/share?url=https://snippy.site' +
                      $router.currentRoute.path +
                      '&text=%0a[' +
                      snipData.snipData.title +
                      ']%0aコードスニペット共有サイト%20Snippy%20%20%23Snippy%0a'
                  "
                >
                  <v-icon left>mdi-twitter</v-icon>Tweets</v-chip
                >
              </v-container>
              <v-divider></v-divider>
              <v-container
                transparent
                subtitle-1
                font-weight-bold
                blue-grey--text
                text--darken-3
                d-flex
                align-end
                justify-start
                py-0
              >
                <v-list-item-action>
                  <v-container pa-0 text-left font-weight-light
                    >Write by : <span class="font-weight-bold">@{{ userData.displayName }}</span></v-container
                  >
                  <v-container pa-0 text-left font-weight-light
                    >Updated :
                    <span class="font-weight-bold">
                      {{ changeUnixTime(snipData.createdAt, "getFullTimestamp") }}
                    </span></v-container
                  >
                  <v-container pa-0 text-left font-weight-light d-flex align-center
                    >Category : <span class="font-weight-bold"> </span
                    ><img
                      class="ml-3"
                      :src="'/img/' + snipData.snipData.tags + '.svg'"
                      alt="category"
                      width="20px"
                      height="auto"
                  /></v-container>
                </v-list-item-action>
                <v-spacer></v-spacer>
              </v-container>
            </v-card>
            <v-card tile elevation="0" height="100%">
              <v-container text-left transparent blue-grey--text text--darken-3 px-0>
                <v-container font-weight-bold title>スニペット</v-container>
                <v-container text-left pa-0 v-if="snipData.snipData.snippets">
                  <v-container py-0>
                    <pre
                      v-highlightjs="snipData.snipData.snippets"
                      style="height:100%"
                    ><code class="java tile"></code></pre>
                  </v-container>
                </v-container>
                <v-container font-weight-bold title pb-0>説明</v-container>
                <v-container pt-0>
                  <v-divider></v-divider>
                </v-container>
                <v-container
                  py-0
                  class="markdown-body"
                  v-html="parseMd(snipData.snipData.contents)"
                  text-left
                ></v-container>
              </v-container>
            </v-card>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
    <v-overlay opacity="0.9" :value="overlay">
      <v-container>このスニペットを削除しますか？</v-container>
      <v-container text-center>
        <v-btn class="mr-5" outlined color="red" @click="deleteSnip">削除</v-btn>
        <v-btn color="grey" @click="overlay = false">キャンセル</v-btn>
      </v-container>
    </v-overlay>
  </v-content>
</template>

<script>
import axios from "axios";
import marked from "marked";
import Mixin from "../mixin/mixin";
import Loading from "@/components/Loading";
import hljs from "highlight.js";

export default {
  name: "ShowCard",
  watch: {
    $route(next, current) {
      if (next.path !== current.path) {
        this.$router.go({ path: next.path, force: true });
      }
    }
  },
  created: async function() {
    try {
      this.$store.dispatch("changeLoading", true);
      marked.setOptions({
        langPrefix: "",
        highlight: function(code, lang) {
          return hljs.highlightAuto(code, [lang]).value;
        }
      });
      const userId = this.$route.params.userId;
      const snipId = this.$route.params.snipId;
      const apiUrl = this.$store.getters.getApiUrl + "api/";
      const result = await axios.get(apiUrl + "snip/" + userId + "/" + snipId);
      this.snipData = result.data.Items[0];
      this.userData = result.data.userData;
      this.editParams = {
        userId: userId,
        snipId: snipId
      };
      console.log(this.snipData);
      if (this.$store.getters.getLoginStatus) {
        const pinResult = await axios.get(
          apiUrl + "snip/pin?userId=" + this.$store.getters.getUserId + "&snipId=" + snipId
        );
        if (pinResult.data.Item)
          this.pin = {
            isPin: true,
            pinIcon: "mdi-pin",
            pinColor: "#C7B967"
          };
      }
      this.$store.dispatch("changeLoading", false);
    } catch (error) {
      this.$store.dispatch("changeLoading", false);
    }
  },
  data: function() {
    return {
      snipData: {
        snipData: {
          title: "",
          contents: ""
        }
      },
      userData: "",
      editParams: {},
      ownSnip: this.$route.params.userId === this.$store.getters.getUserId,
      pin: {
        isPin: false,
        pinIcon: "mdi-pin-outline",
        pinColor: "grey"
      },
      overlay: false
    };
  },
  methods: {
    parseMd: function(text) {
      return marked(text, {
        breaks: true
      });
    },
    deleteSnip: async function() {
      try {
        const apiUrl = this.$store.getters.getApiUrl + "api/";
        await axios.delete(apiUrl + "snip/destroy", {
          data: {
            userId: this.editParams.userId,
            snipId: this.editParams.snipId
          }
        });
        this.$router.push("/");
      } catch (err) {
        alert(JSON.stringify(err));
      }
    },
    toUserPage: function() {
      this.$router.push("/user/" + this.snipData.userId);
    },
    clickSnipPin: async function() {
      try {
        if (!this.$store.getters.getLoginStatus) {
          this.$router.push("/login");
          return;
        }
        const apiUrl = this.$store.getters.getApiUrl + "api/";
        if (this.pin.isPin) {
          await axios.delete(apiUrl + "snip/pin", {
            data: {
              userId: this.$store.getters.getUserId,
              snipId: this.$route.params.snipId,
              snipUserId: this.snipData.userId
            }
          });
          this.pin = {
            isPin: false,
            pinIcon: "mdi-pin-outline",
            pinColor: "grey"
          };
        } else {
          await axios.post(apiUrl + "snip/pin", {
            userId: this.$store.getters.getUserId,
            snipId: this.$route.params.snipId,
            snipUserId: this.snipData.userId,
            snipData: this.snipData.snipData,
            createdAt: this.snipData.createdAt,
            userImgUrl: this.userData.imgUrl
          });
          this.pin = {
            isPin: true,
            pinIcon: "mdi-pin",
            pinColor: "#C7B967"
          };
        }
      } catch (err) {
        alert(JSON.stringify(err));
      }
    }
  },
  components: {
    Loading
  },
  mixins: [Mixin]
};
</script>

<style scoped>
code,
pre,
.markdown-body .highlight pre,
.markdown-body pre {
  background-color: #272822 !important;
  width: 100% !important;
  height: 100% !important;
}
.v-application code {
  box-shadow: none !important;
  -webkit-box-shadow: none !important;
}

@media (max-width: 900px) {
  .v-application .display-1 {
    font-size: 25px !important;
  }
}
</style>
