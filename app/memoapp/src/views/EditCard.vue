<template>
  <v-container fill-height fluid py-0>
    <v-layout text-center wrap>
      <v-flex md12>
        <v-container fluid px-0>
          <v-card elevation="0">
            <v-form>
              <v-container pt-3 pb-0 px-10 fluid>
                <v-text-field v-model="snipData.snipTitle" label="カードタイトル"></v-text-field>
              </v-container>
              <v-container pt-2 px-10 fluid>
                <input-tag v-model="snipData.snipTags" limit="5" placeholder="タグを入力(最大5つ)"></input-tag>
              </v-container>
            </v-form>
          </v-card>
        </v-container>

        <mavon-editor
          language="ja"
          v-model="snipData.snipContents"
          placeholder="カード内容を入力"
          :toolbarsFlag="mobileFlg"
          :subfield="mobileFlg"
        />
        <v-container v-if="editMode" mt-2>
          <v-btn @click="update">UpdateSnippets</v-btn>
        </v-container>
        <v-container v-else mt-2>
          <v-btn @click="add">AddSnippets</v-btn>
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
      snipData: {
        snipTitle: "",
        snipTags: [],
        snipContents: ""
      },
      parseContents: "",
      mobileFlg: !this.$store.getters.getIsMobile,
      userId: this.$route.params.userId,
      snipId: this.$route.params.snipId,
      editMode: false
    };
  },
  mounted: async function() {
    try {
      if (this.userId && this.snipId) {
        this.editMode = true;
        const apiUrl = this.$store.getters.getApiUrl + "api/";
        const url = apiUrl + "snip/" + this.userId + "/" + this.snipId;
        const getResult = await axios.get(url);
        this.snipData.snipTitle = getResult.data.Items[0].snipData.title;
        this.snipData.snipTags = getResult.data.Items[0].snipData.tags;
        this.snipData.snipContents = getResult.data.Items[0].snipData.contents;
      }
    } catch (err) {
      alert(JSON.stringify(err));
    }
  },
  methods: {
    update: async function() {
      try {
        const apiUrl = this.$store.getters.getApiUrl + "api/";
        const url = apiUrl + "snip/update";
        await axios.post(url, {
          userId: this.userId,
          snipId: this.snipId,
          snipTitle: this.snipData.snipTitle,
          snipTags: this.snipData.snipTags,
          snipContents: this.snipData.snipContents
        });
        this.$router.push("/");
      } catch (err) {
        alert(JSON.stringify(err));
      }
    },
    add: async function() {
      try {
        const apiUrl = this.$store.getters.getApiUrl + "api/";
        const url = apiUrl + "snip/add";
        const userInfo = this.$store.getters.getLogin;
        await axios.post(url, {
          snipTitle: this.snipData.snipTitle,
          snipTags: this.snipData.snipTags,
          snipContents: this.snipData.snipContents,
          snipType: 0,
          snipCounts: userInfo.snipCounts,
          userId: userInfo.userId
        });
        this.$store.dispatch("incrementsSnipCounts");
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
