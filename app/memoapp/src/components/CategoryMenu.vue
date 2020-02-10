<template>
  <v-container text-center pa-0 ma-0>
    <v-card outlined elevation="0" class="border-none">
      <v-toolbar
        v-if="!$store.getters.getIsMobile"
        color="black"
        dark
        flat
        dense
        elavation="0"
        class="border-none font-weight-medium"
      >
        <v-toolbar-title>Languages</v-toolbar-title>
      </v-toolbar>
      <v-list dense color="white" class="border-none">
        <v-list-item-group v-model="select">
          <v-list-item v-for="(m, i) in menu" :key="i" @click="changeCategory(m, i)" color="purple">
            <v-list-item-icon>
              <img :src="'img/' + m + '.svg'" style="max-width:40px;max-height:auto" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="m"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-card>
  </v-container>
</template>

<script>
import axios from "axios";

export default {
  Name: "CategoryMenu",
  watch: {},
  data: function() {
    return {
      menu: [],
      select: null
    };
  },
  created: async function() {
    const apiUrl = this.$store.getters.getApiUrl + "api/";
    const categoryUrl = apiUrl + "category/categories";
    const getCategories = await axios.get(categoryUrl);
    getCategories.data.Items.map(v => this.menu.push(v.category));
  },
  component: {},
  methods: {
    changeCategory: async function(language) {
      if (this.$store.getters.getIsMobile) {
        this.$router.push("/?sort=New Snippets&category=" + language);
      } else {
        this.$emit("clickMenu", language);
      }
    }
  }
};
</script>

<style>
.border-none {
  border-right: 0 !important;
  border-left: 0 !important;
  border-bottom: 0 !important;
  border-radius: 0 !important;
}
</style>
