<template>
  <v-card outlined tile color="transparent">
    <v-container text-center px-0 ma-0>
      <v-card tile elevation="0" outlined color="black" dark v-if="!$store.getters.getIsMobile">
        <v-container py-2 transparent subtitle-1 font-weight-bold text-right>スニペット投稿数ランキング</v-container>
      </v-card>
      <v-card :loading="true" outlined tile elevation="0" class="border-none" color="white">
        <v-list dense color="transparent" class="border-none">
          <v-list-item-group color="purple" v-model="select">
            <v-list-item v-for="(m,i) in menu" :key="i">
              <v-list-item-icon class="text-left">
                <v-avator>
                  <img :src="m.imgUrl" style="width:30px;max-width:30px;max-height:auto" />
                </v-avator>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title
                  v-text="m.displayName"
                  class="text-right font-weight-bold caption"
                ></v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
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
      select: 1
    };
  },
  created: async function() {
    const apiUrl = this.$store.getters.getApiUrl + "api/";
    const snipCounts = apiUrl + "ranking/snipCounts";
    const getSnipCounts = await axios.get(snipCounts);
    // getSnipCounts.data.Items.map(v => this.menu.push(v.displayName));
    this.menu = getSnipCounts.data.Items;
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
</style>
