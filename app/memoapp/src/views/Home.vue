<template>
  <v-content class="grey lighten-3">
    <v-container v-if="$store.getters.getErrorMsg" text-center>{{ $store.getters.getErrorMsg }}</v-container>
    <v-container v-if="$store.getters.getLoadingStatus" fill-height fluid>
      <Loading />
    </v-container>
    <v-container v-else fluid pa-0>
      <v-row justify="center" no-gutters>
        <v-col xs="12" sm="12" md="12" lg="10" xl="8">
          <v-row justify="center" no-gutters>
            <v-col v-if="!$store.getters.getIsMobile" md="2" lg="2" xl="2">
              <v-container px-0 py-12 my-12 style="position:sticky; top:0px;">
                <v-container px-0 py-2>
                  <CategoryMenu @clickMenu="clickMenu" />
                </v-container>
              </v-container>
            </v-col>
            <v-col xs="12" sm="12" md="6" lg="6" xl="6">
              <v-container pt-6 pb-0 :class="$store.getters.getIsMobile ? 'px-2' : ''">
                <v-card tile elevation="0">
                  <v-layout justify-start align-center wrap>
                    <v-flex md12 sm12>
                      <v-container
                        blue-grey--text
                        d-flex
                        justify-space-between
                        align-center
                        text--darken-3
                        font-weight-bold
                        title
                      >
                        <v-icon>mdi-console-line</v-icon>
                        <span>投稿されたスニペット</span>
                        <span></span>
                      </v-container>
                    </v-flex>
                  </v-layout>
                </v-card>
              </v-container>
              <v-container py-0 :class="$store.getters.getIsMobile ? 'px-2' : ''">
                <v-divider></v-divider>
              </v-container>
              <v-container py-0 :class="$store.getters.getIsMobile ? 'px-2' : ''">
                <v-container py-0 px-0>
                  <v-tabs grow height="30" color="#C7B967">
                    <v-tab class="caption blue-grey--text text--darken-3">
                      <v-icon small class="mr-1">mdi-code-tags</v-icon>投稿順
                    </v-tab>
                    <v-tab class="caption blue-grey--text text--darken-3">
                      <v-icon small class="mr-1">mdi-pin</v-icon>ピン数順
                    </v-tab>
                    <v-tab class="caption blue-grey--text text--darken-3">
                      <v-icon small class="mr-1">mdi-eye</v-icon>閲覧数順
                    </v-tab>
                  </v-tabs>
                </v-container>
              </v-container>
              <v-container pt-1 pb-0></v-container>
              <v-container
                py-0
                v-for="sd in snipData"
                :key="sd.createdAt"
                :class="$store.getters.getIsMobile ? 'px-2' : 'px-3'"
              >
                <Card :data="sd" :userData="userData" />
                <v-divider></v-divider>
              </v-container>
            </v-col>
            <v-col v-if="!$store.getters.getIsMobile" md="3" lg="3" xl="3">
              <v-container px-0>
                <SnippetCounts />
              </v-container>
              <v-container px-0>
                <CurrentSnippets />
              </v-container>
              <v-container px-0>
                <CurrentPins />
              </v-container>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
import Card from "@/components/Card";
import CategoryMenu from "@/components/CategoryMenu";
import Loading from "@/components/Loading";
// import Search from "@/components/Search";
import SnippetCounts from "@/components/SnippetCounts";
import CurrentSnippets from "@/components/CurrentSnippets";
import CurrentPins from "@/components/CurrentPins";
import axios from "axios";
import Store from "@/store/index.js";
const apiUrl = Store.getters.getApiUrl + "api/";

export default {
  name: "home",
  components: {
    Card,
    CategoryMenu,
    Loading,
    // Search,
    SnippetCounts,
    CurrentSnippets,
    CurrentPins
  },
  props: {},
  watch: {
    async $route(to) {
      try {
        this.$store.dispatch("changeLoading", false);
        const sortKey = to.query.sort ? to.query.sort : "New Snippets";
        const category = to.query.category ? to.query.category : "";
        const result = await axios.get(apiUrl + "snip?sort=" + sortKey + "&category=" + category);
        this.snipData = result.data.Items;
        this.userData = result.data.userData;
        this.$store.dispatch("changeLoading", false);
      } catch (error) {
        this.$store.dispatch("changeLoading", false);
        this.$store.dispatch("updateErorrMsg");
      }
    },
    async sortKey(v) {
      try {
        this.$store.dispatch("changeLoading", true);
        const result = await axios.get(apiUrl + "snip?sort=" + v);
        this.snipData = result.data.Items;
        this.userData = result.data.userData;
        this.$store.dispatch("changeLoading", false);
      } catch (err) {
        this.$store.dispatch("changeLoading", false);
        this.$store.dispatch("updateErorrMsg");
      }
    }
  },
  created: async function() {
    try {
      const category = this.$route.query.category ? this.$route.query.category : "";
      const result = await axios.get(apiUrl + "snip?sort=New Snippets&category=" + category);
      this.snipData = result.data.Items;
      this.userData = result.data.userData;
      this.$store.dispatch("changeLoading", false);
      this.$store.dispatch("initializeErrorMsg");
    } catch (err) {
      console.log(err);
      this.$store.dispatch("updateErorrMsg");
    }
  },
  data: () => ({
    // loading: true,
    snipData: [],
    userData: {},
    sortKey: "New Snippets"
    // selectedMenu: null
  }),
  methods: {
    clickMenu: async function(l) {
      try {
        this.$store.dispatch("changeLoading", true);
        const result = await axios.get(apiUrl + "snip?sort=" + this.sortKey + "&category=" + l);
        this.snipData = result.data.Items;
        this.userData = result.data.userData;
        this.$store.dispatch("changeLoading", false);
      } catch (err) {
        this.$store.dispatch("changeLoading", false);
      }
    }
  }
};
</script>

<style scoped>
.card-margin {
  margin-top: 1px;
}
.tab-border {
  border-left: solid 1px #e0e0e0 !important;
  border-right: solid 1px #e0e0e0 !important;
  border-top: solid 1px #e0e0e0 !important;
  background-color: transparent !important;
  bottom: 1px;
}
</style>
<style>
.menu-card {
  border-left: solid 3px #c7b967 !important;
}
</style>
