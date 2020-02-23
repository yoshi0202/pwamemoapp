<template>
  <span>
    <v-autocomplete
      :light="$store.getters.getIsMobile"
      :dark="!$store.getters.getIsMobile"
      v-model="model"
      :items="items"
      :search-input.sync="search"
      dense
      :solo="solo"
      item-text="title"
      color="purple lighten-2"
      hide-details
      label="フリーワード検索"
      hide-selected
      @click="blankModel"
    >
      <template v-slot:item="{ item }">
        <!-- <v-list-item-avatar class="headline font-weight-light white--text">
          <v-img :src="'/img/' + item.tags[0] + '.svg'" max-height="20" aspect-ratio="1" contain></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title v-text="item.title"></v-list-item-title>
        </v-list-item-content>
        </template>-->
        <v-list-item @click="clickTitle(item.userId, item.snipId)">
          <!-- <v-list-item> -->
          <v-list-item-avatar color="puple lighten-2" class="caption">
            <v-img :src="'/img/' + item.tags[0] + '.svg'" max-height="20" aspect-ratio="1" contain></v-img>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </template>
      <!-- <template v-slot:no-data>
        <v-list-item>
          <v-list-item-title>結果なし</v-list-item-title>
        </v-list-item>
      </template>-->
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
      console.log(v);
    },
    // attr: function(v) {
    //   console.log(v);
    // },
    $route: function() {
      // console.log("change");
      this.value = null;
    },
    // items: function(v) {
    // console.log(`items:${v}`);
    // },
    search: async function(v) {
      if (!v) return (this.items = []);
      if (this.searching) return;
      this.searching = true;
      let self = this;
      setTimeout(async () => {
        const { hits } = await index.search(v);
        console.log(hits);
        for (const h of hits) {
          let obj = {
            ...h.snipData,
            snipId: h.snipId,
            userId: h.userId
          };
          self.items.push(obj);
        }
        self.searching = false;
      }, 1000);
    }
  },
  data: function() {
    return {
      attr: null,
      items: [],
      search: null,
      model: null,
      solo: !this.$store.getters.getIsMobile,
      outlined: !this.$store.getters.getIsMobile,
      searching: false
    };
  },
  methods: {
    clickTitle: function(user, snip) {
      this.$router.push("/" + user + "/snip/" + snip);
      // this.items = [];
    },
    test: function(e) {
      console.log(e);
    },
    blankModel: function() {
      this.model = null;
    }
  }
};
</script>

<style></style>
