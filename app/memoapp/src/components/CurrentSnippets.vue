<template>
  <v-card outlined tile color="transparent">
    <v-container text-center ma-0 :class="$store.getters.getIsMobile ? 'px-2' : 'px-0'">
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
          <v-icon>mdi-eye</v-icon>
          <span>最近閲覧されたスニペット</span>
          <span></span>
        </v-container>
      </v-card>
      <v-card v-if="loading" class="loading px-0" tile elevation="0" :loading="loading"></v-card>
      <v-card outlined tile elevation="0" class="border-none" color="white">
        <v-list dense color="transparent" class="py-0">
          <v-list-item-group color="blue-grey darken-4" v-model="select">
            <template v-for="(m, i) in menu">
              <v-list-item :key="m.snipData.title" @click="$router.push('/' + m.userId + '/snip/' + m.snipId)">
                <template v-slot:default>
                  <v-list-item-avatar size="40px">
                    <v-img :src="user[i].imgUrl" />
                  </v-list-item-avatar>
                  <v-list-item-content>
                    <v-list-item-title
                      v-text="m.snipData.title"
                      class="text-left font-weight-bold caption blue-grey--text text--darken-3"
                    ></v-list-item-title>
                    <v-container pa-0 text-left>
                      <span v-for="t in m.snipData.tags" :key="t" class="mr-2">
                        <img :src="'/img/' + t + '.svg'" alt="tags" width="15px" height="auto" />
                      </span>
                    </v-container>
                  </v-list-item-content>
                  <v-list-item-action>
                    <v-container pa-0 text-center blue-grey--text text--darken-3>
                      <v-container
                        pa-0
                        text-center
                        blue-grey--text
                        text--darken-3
                        caption
                        font-weight-bold
                        v-text="changeUnixTime(m.viewedAt, 'getDate')"
                      ></v-container>
                      <v-container
                        pa-0
                        text-center
                        blue-grey--text
                        text--darken-3
                        caption
                        font-weight-bold
                        v-text="changeUnixTime(m.viewedAt, 'getTime')"
                      ></v-container>
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
import Mixin from "../mixin/mixin";

export default {
  Name: "CurrentSnippets",
  watch: {},
  data: function() {
    return {
      menu: [],
      user: [],
      select: null,
      loading: null
    };
  },
  created: async function() {
    this.loading = "#C7B967";
    const apiUrl = this.$store.getters.getApiUrl + "api/";
    const currentryViewed = apiUrl + "ranking/currentryViewed";
    const getCurrentry = await axios.get(currentryViewed);
    this.menu = getCurrentry.data.snip;
    this.user = getCurrentry.data.user;
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
  },
  mixins: [Mixin]
};
</script>

<style></style>
