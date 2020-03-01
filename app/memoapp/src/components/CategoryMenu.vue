<template>
  <v-card outlined tile color="transparent">
    <v-container text-center px-0 ma-0>
      <v-card tile elevation="0" class="menu-card mb-1" v-if="!$store.getters.getIsMobile">
        <v-container
          py-2
          transparent
          subtitle-1
          font-weight-bold
          text-left
          blue-grey--text
          text--darken-3
          d-flex
          align-center
          justify-space-between
        >
          <v-icon>mdi-view-list</v-icon>
          <span>カテゴリ</span>
          <span></span>
        </v-container>
      </v-card>
      <v-card tile elevation="0" color="white">
        <v-list outlined dense class="py-0">
          <v-list-item-group v-model="select">
            <v-list-item @click="changeCategory('')">
              <template v-slot:default>
                <v-list-item-avatar tile size="20px">
                  <v-icon>mdi-code-tags</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title class="text-left font-weight-bold caption blue-grey--text text--darken-3"
                    >All</v-list-item-title
                  >
                </v-list-item-content>
                <v-list-item-action>
                  <v-icon color="blue-grey darken-3">mdi-chevron-right</v-icon>
                </v-list-item-action>
              </template>
            </v-list-item>
            <v-divider></v-divider>
            <template v-for="(m, i) in menu">
              <v-list-item :key="m" @click="changeCategory(m, i)">
                <template v-slot:default>
                  <v-list-item-avatar tile size="20px">
                    <v-img :src="'img/' + m + '.svg'" contain />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="m"
                      class="text-left font-weight-bold caption blue-grey--text text--darken-3"
                    ></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-icon color="blue-grey darken-3">mdi-chevron-right</v-icon>
                  </v-list-item-action>
                </template>
              </v-list-item>
              <v-divider v-if="i + 1 < menu.length" :key="i"></v-divider>
            </template>
          </v-list-item-group>
        </v-list>
      </v-card>
    </v-container>
  </v-card>
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
      this.$router.push("/?category=" + language);
    }
  }
};
</script>
