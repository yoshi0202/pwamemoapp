<template>
  <v-content>
    <v-form v-model="valid">
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
              dense
              small-chips
              label="カテゴリ"
              auto-select-first
              class="my-2"
              color="purple lighten-2"
              item-color="purple"
              :rules="[rules.required]"
              return-object
              @input="inputCategory"
            >
              <template v-slot:selection="data">
                <v-chip
                  small
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
                  wrap="soft"
                  v-model="snipData.snippets"
                  :rows="$store.getters.getIsMobile ? 5 : 15"
                  label="スニペットを入力"
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
              <v-card tile outlined elevation="0" class="mx-1 mt-1 mb-0 pa-0" height="297px">
                <div class="fill-height overflow-y-auto">
                  <pre
                    v-highlightjs="snipData.snippets"
                    style="height:100%"
                  ><code :class="previewClass" style="background-color:#272822;width:100%; height:100%"></code></pre>
                </div>
              </v-card>
            </v-flex>
          </v-layout>
          <v-card tile outlined elevation="0" :class="wrapperClass" max-width="100%" :color="validColor">
            <mavon-editor
              language="ja"
              code_style="monokai-sublime"
              :externalLink="externalLink"
              v-model="snipData.snipContents"
              placeholder="スニペットの説明を記載(markdownが使えます)"
              :toolbarsFlag="mobileFlg"
              :subfield="mobileFlg"
              :shortCut="false"
              :class="editorClass"
              :toolbars="toolbars"
            />
          </v-card>
        </v-card>
      </v-container>
    </v-form>
    <v-footer fixed class="font-weight-medium" color="black">
      <v-card width="100%" tile elevation="0" color="transparent" class="text-right">
        <v-btn
          :disabled="
            !valid ||
              !snipData.snipContents ||
              !snipData.snipTags ||
              !snipData.snippets.replace(/\s+/g, '') ||
              !snipData.snipTitle.replace(/\s+/g, '')
          "
          dark
          v-if="editMode"
          color="purple lighten-2"
          @click="update"
          class="font-weight-bold"
          >スニペットを更新</v-btn
        >
        <v-btn
          :disabled="
            !valid ||
              !snipData.snipContents ||
              !snipData.snipTags ||
              !snipData.snippets.replace(/\s+/g, '') ||
              !snipData.snipTitle.replace(/\s+/g, '')
          "
          v-else
          dark
          class="font-weight-bold"
          color="purple lighten-2"
          @click="add"
          >スニペットを追加</v-btn
        >
      </v-card>
    </v-footer>
    <v-overlay :value="overlay">
      <v-progress-circular color="#C7B967" indeterminate size="64"></v-progress-circular>
    </v-overlay>
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
      overlay: false,
      valid: true,
      validColor: null,
      snipData: {
        snipTitle: "",
        snipTags: [],
        snipContents: "",
        snippets: ""
      },
      parseContents: "",
      previewClass: "default",
      mobileFlg: !this.$store.getters.getIsMobile,
      userId: this.$route.params.userId,
      snipId: this.$route.params.snipId,
      editMode: false,
      categories: [],
      highlight: {},
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
      },
      editorClass: this.$store.getters.getIsMobile ? "markdown-edit-mobile" : "markdown-edit",
      wrapperClass: this.$store.getters.getIsMobile ? "editor-wrapper-mobile ma-1" : "editor-wrapper ma-1",
      toolbars: {
        preview: true,
        subfield: true
      }
    };
  },
  created: async function() {
    try {
      const categoryUrl = apiUrl + "category/categories";
      const getCategories = await axios.get(categoryUrl);
      getCategories.data.Items.map(v => {
        this.categories.push(v.category);
        this.highlight[v.category] = v.highlight;
      });
      if (this.userId && this.snipId) {
        this.editMode = true;
        if (this.userId !== this.$store.getters.getUserId) {
          this.$router.push("/");
          return;
        }
        const url = apiUrl + "snip/" + this.userId + "/" + this.snipId;
        const getResult = await axios.get(url);
        this.snipData.snipTitle = getResult.data.Items[0].snipData.title;
        this.snipData.snipTags = getResult.data.Items[0].snipData.tags[0];
        this.snipData.snipContents = getResult.data.Items[0].snipData.contents;
        this.snipData.snippets = getResult.data.Items[0].snipData.snippets;
      }
    } catch (err) {
      alert(JSON.stringify(err));
    }
  },
  methods: {
    inputCategory: function(e) {
      this.previewClass = this.highlight[e];
    },
    update: async function() {
      try {
        this.overlay = true;
        const url = apiUrl + "snip/update";
        await axios.post(url, {
          userId: this.userId,
          snipId: this.snipId,
          snipTitle: this.snipData.snipTitle,
          snipTags: this.snipData.snipTags,
          snipContents: this.snipData.snipContents,
          snippets: this.snipData.snippets
        });
        this.overlay = false;
        this.$router.push("/");
      } catch (err) {
        this.overlay = false;
        alert(JSON.stringify(err));
      }
    },
    add: async function() {
      try {
        this.overlay = true;
        const url = apiUrl + "snip/add";
        const userInfo = this.$store.getters.getLogin;
        await axios.post(url, {
          snipTitle: this.snipData.snipTitle,
          snipTags: this.snipData.snipTags,
          snipContents: this.snipData.snipContents,
          snipType: 0,
          snipCounts: userInfo.snipCounts,
          snippets: this.snipData.snippets,
          userId: userInfo.userId
        });
        this.$store.dispatch("incrementsSnipCounts");
        this.overlay = false;
        this.$router.push("/");
      } catch (err) {
        this.overlay = false;
        alert(JSON.stringify(err));
      }
    }
  }
};
</script>

<style>
.markdown-edit {
  height: calc(100vh - 550px);
  z-index: 0 !important;
}
.editor-wrapper {
  max-height: calc(100vh - 550px);
}
.markdown-edit-mobile {
  height: calc(100vh - 360px);
  z-index: 0 !important;
}
.editor-wrapper-mobile {
  max-height: calc(100vh - 360px);
}
.auto-textarea-wrapper .auto-textarea-input {
  font-family: "Roboto , sans-serif" !important;
}
.v-note-wrapper {
  /* min-height: calc(100% - 600px); */
  min-height: calc(100vh - 550px) !important;
}
code:before {
  content: "" !important;
}
code:after {
  content: "" !important;
}
</style>
