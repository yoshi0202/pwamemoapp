<template>
  <span>
    <v-combobox
      :light="$store.getters.getIsMobile"
      :dark="!$store.getters.getIsMobile"
      :items="items"
      dense
      :solo="solo"
      :color="$store.getters.getIsMobile ? 'grey darken-1' : 'white'"
      hide-details
      label="フリーワード検索"
      hide-selected
      item-text="title"
      :search-input.sync="search"
      v-model="input"
      @input="execAlgolia"
      @click:append-outer="execAlgolia"
      append-outer-icon="mdi-magnify"
    >
      <template v-slot:item="{ item }">
        <v-list-item @click="clickTitle(item.userId, item.snipId)">
          <v-list-item-avatar color="puple lighten-2" class="caption">
            <v-img :src="'/img/' + item.tags[0] + '.svg'" max-height="20" aspect-ratio="1" contain></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
    </v-combobox>
  </span>
</template>

<script>
import Algoliasearch from "algoliasearch";
import Store from "@/store/index.js";
const client = Algoliasearch(Store.getters.getAlgoliaAppId, Store.getters.getAlgoliaApiKey);
const index = client.initIndex("snippets");
export default {
  Name: "Search",
  watch: {
    search: function() {
      this.items = [];
    }
  },
  data: function() {
    return {
      items: [],
      search: null,
      solo: !this.$store.getters.getIsMobile,
      outlined: !this.$store.getters.getIsMobile,
      input: null
    };
  },
  methods: {
    clickTitle: function(user, snip) {
      this.search = null;
      this.$router.push("/" + user + "/snip/" + snip);
    },
    blankModel: function() {
      this.model = null;
    },
    execAlgolia: async function() {
      if (!this.search.replace(/\s+/g, "")) return;
      const { hits } = await index.search(this.search);
      for (const h of hits) {
        let obj = {
          ...h.snipData,
          snipId: h.snipId,
          userId: h.userId
        };
        this.items.push(obj);
      }
    }
  }
};
</script>

<style></style>
