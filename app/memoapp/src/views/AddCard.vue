<template>
  <v-container fill-height fluid py-0>
    <v-layout text-center wrap>
      <v-flex md12>
        <v-container fluid px-0>
          <v-card elevation="0">
            <v-form>
              <v-container pt-3 pb-0 fluid>
                <v-text-field label="カードタイトル"></v-text-field>
              </v-container>
              <v-container pt-2 fluid>
                <v-text-field label="タグ"></v-text-field>
              </v-container>
            </v-form>
          </v-card>
        </v-container>

        <mavon-editor language="ja" v-model="cardContents" placeholder="カード内容を入力" />
        <v-container mt-2>
          <v-btn @click="test">submitTest</v-btn>
        </v-container>
        <div v-html="parseContents"></div>
      </v-flex>
    </v-layout>
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

<style>
.markdown-body {
  height: 62%;
}
</style>
