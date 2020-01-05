<template>
  <v-container fill-height fluid py-0>
    <v-layout text-center wrap>
      <v-flex md12>
        <v-container fluid px-0>
          <v-card elevation="0">
            <v-form>
              <v-container pt-3 pb-0 px-10 fluid>
                <v-text-field v-model="cardData.cardTitle" label="カードタイトル"></v-text-field>
              </v-container>
              <v-container pt-2 px-10 fluid>
                <input-tag v-model="cardData.cardTags" limit="5" placeholder="タグを入力(最大5つ)"></input-tag>
              </v-container>
            </v-form>
          </v-card>
        </v-container>

        <mavon-editor
          language="ja"
          v-model="cardData.cardContents"
          placeholder="カード内容を入力"
          :toolbarsFlag="toolBarsFlg"
          :subfield="toolBarsFlg"
        />
        <v-container mt-2>
          <v-btn @click="submit">submitTest</v-btn>
        </v-container>
        <div v-html="parseContents"></div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import marked from "marked";
import isMobile from "ismobilejs";

export default {
  name: "addCard",
  data: function() {
    return {
      cardData: {
        cardTitle: "",
        cardTags: [],
        cardContents: ""
      },
      parseContents: "",
      toolBarsFlg: true,
      subfieldFlg: false
    };
  },
  created: function() {
    if (!isMobile().any) {
      this.subfieldFlg = false;
    }
  },
  methods: {
    submit: function() {
      alert(JSON.stringify(this.cardData));
      alert(marked(this.cardData.cardContents));
      // this.parseContents = marked(this.cardData.cardContents);
    }
  }
};
</script>

<style>
@media (min-width: 1264px) and (max-width: 1903px) {
  .markdown-body {
    height: 62%;
  }
}
</style>
