<template>
  <v-container fluid pa-0 ma-0>
    <v-layout>
      <v-flex md8 offset-md2 text-center>
        <v-container>
          <v-layout wrap align-center>
            <v-flex md12 xs12>
              <v-container text-left title pa-0>
                {{ cardData.cardData.title }}
              </v-container>
            </v-flex>
            <v-flex md12 xs12>
              <v-container text-right align-center pa-0>
                <v-row>
                  <v-col cols="7" class="text-left">
                    <span class="subtitle-2">{{ changeUnixTimeToDate(cardData.createdAt) }}</span>
                  </v-col>
                  <v-spacer></v-spacer>
                  <v-col cols="5">
                    <v-icon
                      v-if="ownCard"
                      class="mx-3"
                      @click="$router.push('/' + editParams.userId + '/card/' + editParams.cardId + '/edit')"
                      >fas fa-edit</v-icon
                    >
                    <v-icon v-if="ownCard" class="mx-3" @click="deleteCard">far fa-trash-alt</v-icon>
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
              <v-chip color="#FFCC80" small v-for="tag in cardData.cardData.tags" :key="tag" class="mx-1 black--text">{{
                tag
              }}</v-chip>
            </v-flex>
          </v-layout>
        </v-container>
        <v-container>
          <v-card>
            <v-container v-html="parseMd(cardData.cardData.contents)" text-left></v-container>
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

export default {
  name: "showCard",
  created: async function() {
    const userId = this.$route.params.user;
    const cardId = this.$route.params.cardid;
    const result = await axios.get(
      "https://u65qbs6yva.execute-api.ap-northeast-1.amazonaws.com/prod/api/" + userId + "/cards/" + cardId
    );
    this.cardData = result.data.Item;
    this.editParams.userId = userId;
    this.editParams.cardId = cardId;
  },
  data: function() {
    return {
      cardData: {},
      editParams: {},
      ownCard: Number(this.$route.params.user) === this.$store.getters.getId
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
        await axios.delete(
          "http://localhost:3000/api/" + this.$route.params.user + "/cards/" + this.$route.params.cardid + "/destroy",
          {}
        );
        this.$router.push("/");
      } catch (err) {
        alert(JSON.stringify(err));
      }
    }
  },
  components: {},
  mixins: [Mixin]
};
</script>

<style></style>
