<template>
  <span>
    <v-autocomplete
      v-model="model"
      :items="items"
      :search-input.sync="search"
      clearable
      dense
      :solo="solo"
      hide-selected
      item-text="title"
      color="purple lighten-2"
      hide-details
      label="検索"
      @input="test(e)"
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
      <template v-slot:no-data>
        <v-list-item>
          <v-list-item-title>
            Search by Algolia
          </v-list-item-title>
        </v-list-item>
      </template>
    </v-autocomplete>
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
    model: function(v) {
      // clickTitle(item.userId, item.snipId)
      console.log(`value:${v}`);
    },
    $route: function() {
      // console.log("change");
      this.value = null;
    },
    search: async function(v) {
      if (v) {
        const { hits } = await index.search(v);
        // console.log(hits);
        for (const h of hits) {
          let obj = {
            ...h.snipData,
            snipId: h.snipId,
            userId: h.userId
          };
          this.items.push(obj);
        }
      } else {
        this.items = [];
      }
    }
  },
  data: function() {
    return {
      items: [],
      search: null,
      model: null,
      solo: !this.$store.getters.getIsMobile
    };
  },
  methods: {
    clickTitle: function(user, snip) {
      this.$router.push("/" + user + "/snip/" + snip);
      this.items = [];
    },
    test: function(e) {
      console.log(e);
    }
  }
};
</script>

<style></style>
