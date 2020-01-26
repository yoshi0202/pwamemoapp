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
          :toolbarsFlag="mobileFlg"
          :subfield="mobileFlg"
        />
        <v-container v-if="editMode" mt-2>
          <v-btn @click="update">UpdateCard</v-btn>
        </v-container>
        <v-container v-else mt-2>
          <v-btn @click="add">AddCard</v-btn>
        </v-container>
        <div v-html="parseContents"></div>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  name: "editCard",
  data: function() {
    return {
      cardData: {
        cardTitle: "",
        cardTags: [],
        cardContents: ""
      },
      parseContents: "",
      mobileFlg: !this.$store.getters.getIsMobile,
      user: this.$route.params.user,
      cardId: this.$route.params.cardid,
      editMode: false
    };
  },
  mounted: async function() {
    try {
      if (this.user && this.cardId) {
        this.editMode = true;
        const apiUrl = this.$store.getters.getApiUrl + "api/";
        const url = apiUrl + this.user + "/cards/" + this.cardId;
        const getResult = await axios.get(url);
        this.cardData.cardTitle = getResult.data.Item.cardData.title;
        this.cardData.cardTags = getResult.data.Item.cardData.tags;
        this.cardData.cardContents = getResult.data.Item.cardData.contents;
      }
    } catch (err) {
      alert(JSON.stringify(err));
    }
  },
  methods: {
    update: async function() {
      try {
        const apiUrl = this.$store.getters.getApiUrl + "api/";
        const url = apiUrl + this.user + "/cards/" + this.cardId + "/update";
        await axios.post(url, {
          title: this.cardData.cardTitle,
          tags: this.cardData.cardTags,
          contents: this.cardData.cardContents
        });
        this.$router.push("/");
      } catch (err) {
        alert(JSON.stringify(err));
      }
    },
    add: async function() {
      try {
        const apiUrl = this.$store.getters.getApiUrl + "api/";
        const user = this.$store.getters.getLogin;
        const url = apiUrl + user.id + "/cards/add";
        await axios.post(url, {
          title: this.cardData.cardTitle,
          cardTags: this.cardData.cardTags,
          contents: this.cardData.cardContents,
          cardType: 0
        });
        this.$router.push("/");
      } catch (err) {
        alert(JSON.stringify(err));
      }
    }
  }
};
</script>

<style>
@media (min-width: 1264px) {
  .markdown-body {
    height: 70%;
  }
}
.markdown-body {
  z-index: 0 !important;
}
</style>
