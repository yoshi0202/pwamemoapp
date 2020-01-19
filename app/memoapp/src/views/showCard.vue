<template>
  <v-container fluid pa-0 ma-0>
    <v-layout>
      <v-flex md8 offset-md2 text-center>
        <v-layout>
          <v-flex>
            <v-container text-left title>{{ cardData.cardData.title }}</v-container>
          </v-flex>
          <v-flex>
            <v-container text-right title>
              <v-icon
                v-if="ownCard"
                class="mx-2"
                @click="$router.push('/' + editParams.userId + '/card/' + editParams.cardId + '/edit')"
              >fas fa-edit</v-icon>
              <v-icon v-if="ownCard" class="mx-2" @click="deleteCard">far fa-trash-alt</v-icon>
            </v-container>
          </v-flex>
        </v-layout>
        <v-divider></v-divider>
        <v-container text-left>
          <v-layout>
            <v-flex>
              <v-chip v-for="tag in cardData.cardData.tags" :key="tag" small>{{ tag }}</v-chip>
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
  }
};
</script>

<style></style>
