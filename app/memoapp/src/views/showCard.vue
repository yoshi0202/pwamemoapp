<template>
  <v-container fluid pa-0 ma-0>
    <v-layout>
      <v-flex text-center>
        <v-container text-left title>
          {{ cardData.cardData.title }}
          <v-divider></v-divider>
        </v-container>
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
  mounted: async function() {
    const userId = this.$route.params.user;
    const cardId = this.$route.params.cardid;
    const result = await axios.get(
      "https://u65qbs6yva.execute-api.ap-northeast-1.amazonaws.com/prod/api/" + userId + "/cards/" + cardId
    );
    this.cardData = result.data.Item;
    console.log(marked(JSON.stringify(this.cardData)));
  },
  data: function() {
    return {
      cardData: {}
    };
  },
  created: function() {},
  methods: {
    parseMd: function(text) {
      return marked(text);
    }
  }
};
</script>

<style></style>
