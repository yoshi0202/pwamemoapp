<template>
  <v-card outlined tile color="transparent">
    <v-container text-center ma-0 :class="$store.getters.getIsMobile ? 'px-1' : 'px-0'">
      <v-card tile elevation="0" class="menu-card mb-1">
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
          <v-icon>mdi-pencil</v-icon>
          <span>投稿数ランキング</span>
          <span></span>
        </v-container>
      </v-card>
      <v-card v-if="loading" class="pb-1 px-0" tile elevation="0" :loading="loading"></v-card>
      <v-card outlined tile elevation="0" color="white">
        <v-list dense color="transparent" class="py-0">
          <v-list-item-group v-model="select">
            <template v-for="(m, i) in menu">
              <v-list-item :key="m.displayName" @click="$router.push('/user/' + m.userId)">
                <template v-slot:default>
                  <v-list-item-avatar size="40px">
                    <img :src="m.imgUrl" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="m.displayName"
                      class="text-left font-weight-bold subtitle-1 blue-grey--text text--darken-3"
                    ></v-list-item-title>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-container pa-0 text-center blue-grey--text text--darken-3>
                      <v-container pa-0 font-weight-bold v-text="m.snipCounts"></v-container>
                      <v-container pa-0 caption>Snippets</v-container>
                    </v-container>
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
  Name: "SnippetCounts",
  watch: {},
  data: function() {
    return {
      menu: [],
      select: null,
      loading: null
    };
  },
  created: async function() {
    this.loading = "purple";
    const apiUrl = this.$store.getters.getApiUrl + "api/";
    const snipCounts = apiUrl + "ranking/snipCounts";
    const getSnipCounts = await axios.get(snipCounts);
    this.menu = getSnipCounts.data.Items;
    this.loading = null;
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

<style></style>
