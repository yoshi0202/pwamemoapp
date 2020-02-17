<template>
  <v-content>
    <v-container fill-height>
      <v-layout class="justify-center" wrap>
        <v-flex xs12 sm12 md12 lg10 xl8 text-center>
          <Loading />
          <v-container>
            <v-card tile outlined height="100%">
              <v-list-item style="background-color:#000000;" dark>
                <v-card-title class="py-3 ma-0 px-0" style="width:100%">
                  <v-container pa-0 ma-0 d-flex justify-space-between>
                    {{ snipData.snipData.title }}
                    <v-spacer></v-spacer>
                    <v-icon class="mx-3" :color="pin.pinColor" @click="clickSnipPin">{{ pin.pinIcon }}</v-icon>
                    <v-menu offset-y v-if="ownSnip">
                      <template v-slot:activator="{ on }">
                        <v-btn small dark icon v-on="on">
                          <v-icon color="#C7B967">
                            mdi-dots-vertical
                          </v-icon>
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
                          <!-- <v-menu top offset-y> -->
                          <!-- <template v-slot:activator="{ on }"> -->
                          <span class="caption">
                            <v-icon v-on="on" medium color="red">mdi-trash-can-outline</v-icon>
                            <span class="ml-3 red--text">削除</span>
                          </span>
                          <!-- </template> -->

                          <!-- <v-list dense>
                              <v-list-item @click="deleteSnip" style="cursor:pointer">
                                <v-list-item-title>
                                  <span class="caption">
                                    <v-icon medium color="red">mdi-exclamation</v-icon>
                                    <span class="ml-3 red--text font-weight-bold">削除</span>
                                  </span>
                                </v-list-item-title>
                              </v-list-item>
                            </v-list>
                          </v-menu> -->
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </v-container>
                </v-card-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-avatar size="50" color="grey">
                  <img @click="toUserPage" :src="userData" alt="avator" style="cursor: pointer;" />
                </v-list-item-avatar>
                <v-list-item-content class="fluid">
                  <v-layout wrap>
                    <v-flex mb12 xs12>
                      <v-container text-left>@xxxxxxxxxxxxxxxxxx</v-container>
                    </v-flex>
                    <v-flex mb12 xs12 class="text-left">
                      <v-container text-left font-weight-thin>
                        {{ changeUnixTimeToDate(snipData.createdAt) }}
                      </v-container>
                    </v-flex>
                  </v-layout>
                </v-list-item-content>
              </v-list-item>
              <v-container text-left>
                <v-chip small v-for="tag in snipData.snipData.tags" :key="tag" class="mx-1 black--text" color="grey">
                  <v-avatar left>
                    <img :src="'/img/' + tag + '.svg'" />
                  </v-avatar>
                  {{ tag }}
                </v-chip>
              </v-container>
              <v-container text-left pb-0 v-if="snipData.snipData.snippets">
                <v-container py-0>
                  <pre
                    v-highlightjs="snipData.snipData.snippets"
                    style="height:100%"
                  ><code class="javascript tile" style="background-color:#272822;width:100%; height:100%"></code></pre>
                </v-container>
              </v-container>
              <v-container>
                <v-divider></v-divider>
                <v-container class="markdown-body" v-html="parseMd(snipData.snipData.contents)" text-left></v-container>
              </v-container>
            </v-card>
          </v-container>
        </v-flex>
      </v-layout>
    </v-container>
    <v-overlay opacity="0.9" :value="overlay">
      <v-container>
        このスニペットを削除しますか？
      </v-container>
      <v-container text-center>
        <v-btn class="mr-5" outlined color="red" @click="deleteSnip">
          削除
        </v-btn>
        <v-btn color="grey" @click="overlay = false">
          キャンセル
        </v-btn>
      </v-container>
    </v-overlay>
  </v-content>
</template>

<script>
import axios from "axios";
import marked from "marked";
import Mixin from "../mixin/mixin";
import Loading from "@/components/Loading";

export default {
  name: "ShowCard",
  created: async function() {
    try {
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
            userImgUrl: this.userData
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

<style></style>
