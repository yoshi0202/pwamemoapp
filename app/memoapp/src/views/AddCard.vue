<template>
  <v-container fluid>
    <v-layout text-center wrap>
      <v-flex md12>
        <mavon-editor language="ja" v-model="cardContents" />
      </v-flex>
    </v-layout>
    <v-btn @click="test">submitTest</v-btn>
    <div v-html="parseContents"></div>
  </v-container>
</template>

<script>
import marked from "marked";
export default {
  name: "addCard",
  data: function() {
    return {
      cardContents: "",
      parseContents: ""
    };
  },
  methods: {
    test: function() {
      this.parseContents = marked(this.cardContents);
    }
  }
};
</script>

<style></style>
