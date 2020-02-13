<template>
  <v-content>
    <v-container fluid pa-0 ma-0 fill-height>
      <v-card outlined tile elevation="0" class="pa-0" height="100%" width="100%">
        <v-card tile elevation="0" class="mx-1 my-2">
          <v-text-field
            v-model="snipData.snipTitle"
            label="スニペットタイトル"
            outlined
            hide-details
            :rules="[rules.required]"
            class="my-2"
            color="purple lighten-2"
          ></v-text-field>
          <v-autocomplete
            v-model="snipData.snipTags"
            :items="categories"
            hide-details
            outlined
            eager
            dense
            chips
            small-chips
            label="カテゴリ(5つまで選択)"
            multiple
            auto-select-first
            class="my-2"
            color="purple lighten-2"
            item-color="purple"
            :rules="[rules.min, rules.required]"
          >
            <template v-slot:selection="data">
              <v-chip
                :key="JSON.stringify(data.item)"
                v-bind="data.attrs"
                :input-value="data.selected"
                :disabled="data.disabled"
                @click:close="data.parent.selectItem(data.item)"
              >
                <v-avatar left>
                  <img :src="'/img/' + data.item + '.svg'" />
                </v-avatar>
                {{ data.item }}
              </v-chip>
            </template>
          </v-autocomplete>
        </v-card>
        <v-layout wrap style="max-height:100%">
          <v-flex xs12 sm12 md6 lg6>
            <v-card tile elevation="0" class="mx-1 pa-0">
              <v-textarea
                v-model="snipData.snippets"
                rows="5"
                label="スニペットを入力(5行以内だと表示の時に省略されません)"
                dense
                outlined
                hide-details
                :rules="[rules.required]"
                class="my-1"
                color="purple lighten-2"
              ></v-textarea>
            </v-card>
          </v-flex>
          <v-flex v-if="!$store.getters.getIsMobile" xs12 sm12 md6 lg6>
            <v-card tile outlined elevation="0" class="mx-1 mt-1 mb-0 pa-0" height="118px">
              <div class="fill-height overflow-y-auto">
                <pre
                  v-highlightjs="snipData.snippets"
                  style="height:100%"
                ><code class="javascript" style="background-color:#272822;width:100%; height:100%"></code></pre>
              </div>
            </v-card>
          </v-flex>
        </v-layout>
        <v-card tile outlined elevation="0" class="ma-1" max-width="100%" :style="{ height: editorVh }">
          <mavon-editor
            language="ja"
            code_style="monokai"
            :externalLink="externalLink"
            v-model="snipData.snipContents"
            placeholder="スニペットの説明を記載(markdownが使えます)"
            :toolbarsFlag="mobileFlg"
            :subfield="mobileFlg"
            class="markdown-edit"
          />
        </v-card>
      </v-card>
    </v-container>
    <v-footer fixed class="font-weight-medium" color="black">
      <v-card width="100%" tile elevation="0" color="transparent" class="text-right">
        <v-btn dark v-if="editMode" color="purple lighten-2" @click="update" class="font-weight-bold"
          >スニペットを更新</v-btn
        >
        <v-btn v-else dark class="font-weight-bold" color="purple lighten-2" @click="add">スニペットを追加</v-btn>
      </v-card>
    </v-footer>
  </v-content>
</template>

<script>
import axios from "axios";
import Store from "@/store/index.js";
const apiUrl = Store.getters.getApiUrl + "api/";

export default {
  name: "editCard",
  watch: {},
  data: function() {
    return {
      editorVh: "calc(100% - 310px)",
      valid: true,
      snipData: {
        snipTitle: "",
        snipTags: [],
        snipContents: "",
        snippets: "スニペットプレビュー"
      },
      parseContents: "",
      mobileFlg: !this.$store.getters.getIsMobile,
      userId: this.$route.params.userId,
      snipId: this.$route.params.snipId,
      editMode: false,
      categories: [],
      rules: {
        required: v => !!v || "必須項目",
        regex: v =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            v
          ) || "E-mail must be valid",
        min: v => (v && v.length <= 5) || "カテゴリは5個以内で選択してください。"
      },
      externalLink: {
        hljs_js: function() {
          return "/highlightjs/highlight.pack.js";
        },
        hljs_css: function() {
          return "/highlightjs/monokai-sublime.css";
        },
        hljs_lang: function() {
          return "/highlightjs/highlight.pack.js";
        }
      }
    };
  },
  mounted: async function() {
    try {
      const categoryUrl = apiUrl + "category/categories";
      const getCategories = await axios.get(categoryUrl);
      getCategories.data.Items.map(v => this.categories.push(v.category));
      if (this.userId && this.snipId) {
        this.editMode = true;
        if (this.userId !== this.$store.getters.getUserId) {
          this.$router.push("/");
          return;
        }
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
.markdown-edit {
  height: calc(100vh - 370px);
  z-index: 0 !important;
}
.auto-textarea-wrapper .auto-textarea-input {
  font-family: "Roboto , sans-serif" !important;
}
code:before {
  content: "" !important;
}
code:after {
  content: "" !important;
}
</style>
