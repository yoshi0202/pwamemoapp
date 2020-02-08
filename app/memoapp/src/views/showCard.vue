<template>
  <v-container fluid pa-0 ma-0>
    <v-layout>
      <v-flex md8 offset-md2 text-center>
        <Loading />
        <v-container>
          <v-layout wrap align-center>
            <v-flex md12 xs12>
              <v-container text-left title pa-0 style="word-break:break-all">{{ snipData.snipData.title }}</v-container>
            </v-flex>
            <v-flex md12 xs12>
              <v-container text-right align-center pa-0>
                <v-row class="align-center" style="height:100px">
                  <v-col cols="8" class="text-left align-center">
                    <v-avatar>
                      <img @click="toUserPage" :src="userData" alt="avator" style="cursor: pointer;" />
                    </v-avatar>
                    <span class="px-4 subtitle-2">{{ changeUnixTimeToDate(snipData.createdAt) }}</span>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="4">
                    <v-icon
                      v-if="ownSnip"
                      class="mx-3"
                      @click="$router.push('/' + editParams.userId + '/snip/' + editParams.snipId + '/edit')"
                      >fas fa-edit</v-icon
                    >
                    <v-icon v-if="ownSnip" class="mx-3" @click="deleteCard">far fa-trash-alt</v-icon>
                  </v-col>
                </v-row>
              </v-container>
            </v-flex>
          </v-layout>
          <v-divider></v-divider>
        </v-container>
        <v-container text-left>
          <v-layout>
            <v-flex>
              <v-chip small v-for="tag in snipData.snipData.tags" :key="tag" class="mx-1 black--text" color="white">
                <v-avatar left>
                  <img :src="'/img/' + tag + '.svg'" />
                </v-avatar>
                {{ tag }}
              </v-chip>
            </v-flex>
          </v-layout>
        </v-container>
        <v-container>
          <v-card>
            <v-container v-html="parseMd(snipData.snipData.contents)" text-left></v-container>
          </v-card>
        </v-container>
        <v-container>
          <v-divider></v-divider>
        </v-container>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";
import marked from "marked";
import Mixin from "../mixin/mixin";
import Loading from "@/components/Loading";

export default {
  name: "showCard",
  created: async function() {
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
    this.$store.dispatch("changeLoading", false);
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
      ownSnip: this.$route.params.userId === this.$store.getters.getUserId
    };
  },
  methods: {
    parseMd: function(text) {
      return marked(text, {
        breaks: true
      });
    },
    deleteCard: async function() {
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
    }
  },
  components: {
    Loading
  },
  mixins: [Mixin]
};
</script>

<style></style>
